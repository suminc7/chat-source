import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Dimensions,
    TextInput,
    KeyboardAvoidingView,
    TouchableOpacity,
    FlatList,
    Platform
} from 'react-native';
import SocketIOClient from 'socket.io-client';
// import KeyboardSpacer from 'react-native-keyboard-spacer';

var windowSize = Dimensions.get('window');

export default class ChatScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: `Chat Room`,
        // header: null,
    });

    constructor(props) {
        super(props);

        const { params } = this.props.navigation.state;

        this.state = {
            username: params.username,
            message: '',
            messages: [],
            keyCount: 0
        };



        this.onSendPress = this.onSendPress.bind(this)
        console.log('ChatScreen')

        // this.socket = SocketIOClient(process.env.SOCKET_URL || 'http://35.184.228.131/', {reconnection: true});
        this.socket = SocketIOClient(process.env.SOCKET_URL || 'http://192.168.0.12:8080');
        // this.socket = SocketIOClient(process.env.SOCKET_URL || 'http://172.30.1.15:8080', {reconnection: false});
        // this.socket = SocketIOClient(process.env.SOCKET_URL || 'http://localhost:8080', {reconnection: false});


        this.socket.on('connect', (data) => {
            this.socket.emit('userJoined', {userId: this.socket.id, username: this.state.username});

            this.socket.on('roomList', (userId) => {
                // this.setState({messages: this.state.messages})
                this._addMessage('userJoined: ', userId)
            });

            this.socket.on('userJoined', (userId) => {
                // this.setState({messages: this.state.messages})
                this._addMessage('userJoined: ', userId)
            });

            this.socket.on('message', (message) => {
                this._addMessage(message)
            });

            this.socket.on('connect_error', () => {
                this._addMessage('connect_error')
            });
            this.socket.on('connect_timeout', () => {
                this._addMessage('connect_timeout')
            });
        })




    }

    componentWillUnmount() {
        this.socket.disconnect()
        // alert('adf')
    }

    onSendPress() {
        if(this.state.message === ''){
            return;
        }
        const message = this.state.message.trim();
        if(message === ''){
            return;
        }

        this.socket.emit('message', message);
        this.setState({message: ''});
        this._addMessage(message, true)

    }

    _addMessage(message, currentUser = false) {
        this.state.messages.unshift({message: message, key: Math.floor(Math.random()*9999999), currentUser })
        this.setState({messages: this.state.messages});

    }

    _renderItem({ item }) {

        let userStyle = {};
        if(item.currentUser){
            userStyle = styles.messageItemCurrentUser
        }

        return (
            <View  key={item.key} style={[styles.messageItem, userStyle]}>
                <Text style={styles.messageText}>{item.message}</Text>
            </View>
        )
    }

    render() {


        return (
            <KeyboardAvoidingView
                style={styles.container}
                behavior={
                    Platform.select({
                        ios: () => 'padding',
                        android: () => null
                    })()
                }
                keyboardVerticalOffset={
                    Platform.select({
                        ios: () => 64,
                        android: () => 0
                    })()
                }>
                <FlatList
                    inverted
                    style={styles.messageContainer}
                    data={this.state.messages}
                    renderItem={this._renderItem}
                    ref={ref => this.flatList = ref }
                    onContentSizeChange={(contentWidth, contentHeight) => {
                        this.flatList.scrollToOffset({offset:0})
                    }}
                />

                <View style={styles.inputContainer}>
                    <View style={styles.textContainer}>
                        <TextInput
                            style={styles.input}
                            value={this.state.message}
                            onChangeText={(text) => this.setState({message: text})}
                            underlineColorAndroid={'transparent'}
                        />
                    </View>
                    <TouchableOpacity
                        // underlayColor={'#191526'}
                        onPress={() => this.onSendPress()}
                    >
                        <View style={styles.sendContainer}>

                                <Text style={styles.sendLabel}>SEND</Text>

                        </View>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )


    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#000'
        paddingTop: 5,
    },
    messageContainer: {
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
    },
    messageItem: {
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#FFF',
        marginBottom: 10,
        alignSelf: 'flex-start',
    },
    messageItemCurrentUser: {
        alignSelf: 'flex-end',
    },
    messageText: {
        fontSize: 13,
    },
    inputContainer: {
        height: 40,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#08aa8a'
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        // backgroundColor: '#bb825d',
        // padding: 10
    },
    sendContainer: {
        justifyContent: 'center',
        paddingRight: 10,
        paddingLeft: 10,
        marginRight: 10,
        borderRadius: 20,
        backgroundColor: '#08725a',
    },
    sendLabel: {
        color: '#ffffff',
        fontSize: 12,
        paddingTop: 5,
        paddingBottom: 5,
        justifyContent: 'center',
        // backgroundColor: '#bb372d',
        textAlign: 'center'
    },
    input: {
        fontSize: 12,
        width: '100%',
        color: '#ffffff',
        paddingRight: 10,
        paddingLeft: 10,
        paddingTop: 2,
        height: 32,
        // borderColor: '#6E5BAA',
        // borderWidth: 1,
        borderRadius: 20,
        alignSelf: 'center',
        // backgroundColor: '#ffffff'
    },
})