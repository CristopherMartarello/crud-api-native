import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    Switch,
    TouchableOpacity,
    Button,
    StyleSheet,
    Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';


const ModalProductForm = ({ visivel, onFechar, onSalvar, produto }) => {
    const [nome, setNome] = useState('');
    const [categoria, setCategoria] = useState('');
    const [disponivel, setDisponivel] = useState(false);
    const [tipo, setTipo] = useState('');
    const [tags, setTags] = useState({ promoção: false, lançamento: false });

    useEffect(() => {
        if (produto) {
            setNome(produto.name || '');
            setCategoria(produto.categoria || '');
            setDisponivel(produto.disponivel || false);
            setTipo(produto.tipo || '');
            setTags({
                promoção: produto.tags?.includes('promoção') || false,
                lançamento: produto.tags?.includes('lançamento') || false,
            });
        }
    }, [produto]);

    const validarCampos = () => {
        if (!nome.trim()) return 'Nome é obrigatório.';
        if (!categoria) return 'Selecione uma categoria.';
        if (!tipo) return 'Escolha o tipo.';
        return null;
    };

    const handleSalvar = () => {
        const erro = validarCampos();
        if (erro) {
            Alert.alert('Erro de Validação', erro);
            return;
        }

        const dados = {
            name: nome,
            categoria,
            disponivel,
            tipo,
            tags: Object.keys(tags).filter((t) => tags[t]),
        };

        onSalvar(dados);
    };

    return (
        <Modal visible={visivel} animationType="slide" transparent>
            <View style={styles.modalFundo}>
                <View style={styles.modalConteudo}>
                    <Text style={styles.titulo}>Editar Produto</Text>

                    <TextInput
                        placeholder="Nome"
                        value={nome}
                        onChangeText={setNome}
                        style={styles.input}
                    />

                    <Picker selectedValue={categoria} onValueChange={setCategoria} style={styles.input}>
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
                                style={{ marginRight: 15, flexDirection: 'row', alignItems: 'center' }}
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

                    <Button title="Salvar" onPress={handleSalvar} />
                    <View style={{ marginTop: 10 }} />
                    <Button title="Cancelar" color="gray" onPress={onFechar} />
                </View>
            </View>
        </Modal>
    );
};

export default ModalProductForm;

const styles = StyleSheet.create({
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
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        padding: 8,
        marginVertical: 10,
        borderRadius: 5,
        borderColor: '#ccc',
    },
    radio: {
        height: 16,
        width: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#007AFF',
    },
    radioSelecionado: {
        backgroundColor: '#007AFF',
    },
    checkbox: {
        width: 18,
        height: 18,
        borderWidth: 1,
        borderColor: '#007AFF',
        backgroundColor: 'white',
    },
    checkboxSelecionado: {
        backgroundColor: '#007AFF',
    },
});
