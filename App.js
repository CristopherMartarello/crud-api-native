import axios from 'axios';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import ModalProdutoForm from './components/ModalProduct';

const URL_BASE = 'https://cacc713e7b037522f0a4.free.beeceptor.com/api/products';

const ProdutoCRUD = () => {
  const [produtos, setProdutos] = useState([]);

  const [novoProdutoNome, setNovoProdutoNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [disponivel, setDisponivel] = useState(false);
  const [tipo, setTipo] = useState('');
  const [tags, setTags] = useState({ promoção: false, lançamento: false });

  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [confirmacaoExclusao, setConfirmacaoExclusao] = useState({ visivel: false, id: null });

  useEffect(() => {
    buscarProdutos();
  }, []);

  const buscarProdutos = async () => {
    try {
      const resposta = await axios.get(URL_BASE);
      setProdutos(resposta.data);
    } catch (erro) {
      console.error('Erro ao buscar produtos:', erro);
    }
  };

  const validarCampos = () => {
    if (!novoProdutoNome.trim()) return 'Nome é obrigatório.';
    if (!categoria) return 'Selecione uma categoria.';
    if (!tipo) return 'Escolha um tipo.';
    return null;
  };

  const adicionarProduto = async () => {
    const erro = validarCampos();
    if (erro) return Alert.alert('Erro de Validação', erro);

    try {
      const novoProduto = {
        name: novoProdutoNome,
        categoria,
        disponivel,
        tipo,
        tags: Object.keys(tags).filter((t) => tags[t]),
      };
      await axios.post(URL_BASE, novoProduto);
      buscarProdutos();
      setNovoProdutoNome('');
      setCategoria('');
      setDisponivel(false);
      setTipo('');
      setTags({ promoção: false, lançamento: false });
    } catch (erro) {
      console.error('Erro ao adicionar produto:', erro);
    }
  };

  const abrirModalEdicao = (produto) => {
    setProdutoSelecionado(produto);
    setModalVisivel(true);
  };

  const editarProduto = async (dadosAtualizados) => {
    try {
      await axios.put(`${URL_BASE}/${produtoSelecionado.id}`, dadosAtualizados);
      buscarProdutos();
      setModalVisivel(false);
      setProdutoSelecionado(null);
    } catch (erro) {
      console.error('Erro ao atualizar produto:', erro);
    }
  };

  const confirmarRemocao = (id) => {
    setConfirmacaoExclusao({ visivel: true, id });
  };

  const removerProduto = async () => {
    try {
      await axios.delete(`${URL_BASE}/${confirmacaoExclusao.id}`);
      buscarProdutos();
      setConfirmacaoExclusao({ visivel: false, id: null });
    } catch (erro) {
      console.error('Erro ao remover produto:', erro);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastrar Novo Produto</Text>

      <TextInput
        placeholder="Nome do produto"
        value={novoProdutoNome}
        onChangeText={setNovoProdutoNome}
        style={styles.input}
      />

      <Picker
        selectedValue={categoria}
        onValueChange={(itemValue) => setCategoria(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="Selecione uma categoria" value="" />
        <Picker.Item label="Alimentos" value="alimentos" />
        <Picker.Item label="Roupas" value="roupas" />
        <Picker.Item label="Eletrônicos" value="eletronicos" />
      </Picker>

      <Text style={{ marginTop: 10 }}>Tipo:</Text>
      <View style={{ flexDirection: 'row', marginVertical: 5 }}>
        {['Novo', 'Usado'].map((valor) => (
          <TouchableOpacity
            key={valor}
            onPress={() => setTipo(valor)}
            style={{
              marginRight: 15,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View style={[styles.radio, tipo === valor && styles.radioSelecionado]} />
            <Text style={{ marginLeft: 5 }}>{valor}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text>Tags:</Text>
      {Object.keys(tags).map((tag) => (
        <TouchableOpacity
          key={tag}
          onPress={() => setTags({ ...tags, [tag]: !tags[tag] })}
          style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 3 }}
        >
          <View style={[styles.checkbox, tags[tag] && styles.checkboxSelecionado]} />
          <Text style={{ marginLeft: 5 }}>{tag.toUpperCase()}</Text>
        </TouchableOpacity>
      ))}

      <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
        <Text>Disponível: </Text>
        <Switch value={disponivel} onValueChange={setDisponivel} />
      </View>

      <Button title="Adicionar Produto" onPress={adicionarProduto} />

      <Text style={styles.titulo}>Produtos Cadastrados</Text>
      <FlatList
        data={produtos}
        keyExtractor={(produto) => produto.id.toString()}
        renderItem={({ item: produto }) => (
          <View style={styles.produtoContainer}>
            <Text style={styles.produtoTexto}>{produto.name}</Text>
            <View style={styles.botoes}>
              <TouchableOpacity onPress={() => abrirModalEdicao(produto)}>
                <Icon name="edit" size={24} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => confirmarRemocao(produto.id)}
                style={{ marginLeft: 15 }}
              >
                <Icon name="delete" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal Edição */}
      <ModalProdutoForm
        visivel={modalVisivel}
        onFechar={() => setModalVisivel(false)}
        onSalvar={editarProduto}
        produto={produtoSelecionado}
      />

      {/* Modal Confirmação de Exclusão */}
      <Modal visible={confirmacaoExclusao.visivel} transparent animationType="fade">
        <View style={styles.modalFundo}>
          <View style={styles.modalConteudo}>
            <Text style={styles.titulo}>Confirmar Exclusão</Text>
            <Text>Tem certeza que deseja excluir este produto?</Text>
            <View style={{ marginTop: 20 }}>
              <Button title="Sim, excluir" onPress={removerProduto} color="#FF3B30" />
              <View style={{ marginTop: 10 }} />
              <Button
                title="Cancelar"
                onPress={() => setConfirmacaoExclusao({ visivel: false, id: null })}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProdutoCRUD;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    marginVertical: 10,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  produtoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f2f2f2',
    marginVertical: 5,
    borderRadius: 5,
  },
  produtoTexto: {
    fontSize: 16,
    flex: 1,
  },
  botoes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalFundo: {
    flex: 1,
    backgroundColor: '#000000aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalConteudo: {
    backgroundColor: '#fff',
    padding: 20,
    width: '90%',
    borderRadius: 10,
    elevation: 5,
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  radioSelecionado: {
    backgroundColor: '#007AFF',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  checkboxSelecionado: {
    backgroundColor: '#007AFF',
  },
});
