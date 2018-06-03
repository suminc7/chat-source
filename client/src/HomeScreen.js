import React from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableHighlight } from 'react-native';

export default class HomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Home',
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            username: ''
        };

        this.onPress = this.onPress.bind(this)
    }

    onPress() {
        if(this.state.username === '' || this.state.username.trim() === ''){
            return;
        }

        const { navigate } = this.props.navigation;
        navigate('Room', { username: this.state.username })
    }
    render() {

        return (
            <View style={styles.container}>
                <View style={styles.loginContainer}>
                    <TextInput
                        style={styles.input}
                        value={this.state.username}
                        onChangeText={(text) => this.setState({username: text})}
                        placeholder={'Enter User Nickname'}
                        maxLength={12}
                        multiline={false}
                    />
                    <TouchableHighlight
                        style={styles.button}
                        underlayColor={'#328FE6'}
                        onPress={this.onPress}
                    >
                        <Text style={styles.label}>LOGIN</Text>
                    </TouchableHighlight>
                </View>

            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#eaeaea'
    },
    loginContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: 250,
        color: '#555555',
        padding: 10,
        height: 50,
        borderColor: '#32C5E6',
        borderWidth: 1,
        borderRadius: 4,
        alignSelf: 'center',
        backgroundColor: '#ffffff'
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#328FE6',
        padding: 10,
        marginTop: 10,
        backgroundColor: '#32c5e6'
    },
    label: {
        width: 230,
        alignSelf: 'center',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '600',
        color: '#ffffff'
    }
});