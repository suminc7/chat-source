import React from 'react';
import {
    Text,
    View,
    FlatList,
    TouchableOpacity,
    StyleSheet
} from 'react-native';

export default class ChatScreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: `Rooms`,
        // header: null,
    });

    constructor(props) {
        super(props);

        const { params } = this.props.navigation.state;

        this.state = {
            username: params.username,
            rooms: [],
            page: 0
        };



        this.onSendPress = this.onSendPress.bind(this)
        this._getRoomList = this._getRoomList.bind(this)
        this._onMore = this._onMore.bind(this)
        console.log('RoomScreen')




        // // this.socket = SocketIOClient(process.env.SOCKET_URL || 'http://35.184.228.131/', {reconnection: true});
        // this.socket = io((process.env.SOCKET_URL || 'http://192.168.0.12:8080') + '/lobby');
        // // this.socket = SocketIOClient(process.env.SOCKET_URL || 'http://172.30.1.15:8080', {reconnection: false});
        // // this.socket = SocketIOClient(process.env.SOCKET_URL || 'http://localhost:8080', {reconnection: false});
        //
        //
        // this.socket.on('connect', (data) => {
        //     this.socket.on('roomList', (rooms) => {
        //         console.log(rooms)
        //         // this.state.rooms = rooms
        //
        //         let room = _chunk(rooms, 2)
        //
        //         this.setState({rooms: _map(room, arr => _zipObject(['key', 'title'], arr))})
        //         // room.forEach(array => {
        //         //     console.log(array)
        //         //     console.log()
        //         // })
        //
        //         console.log(room)
        //
        //
        //     });
        //     this.socket.emit('roomList')
        // })




    }

    _getRoomList() {
        const page = this.state.page + 1
        console.log('page', page)
        fetch('http://localhost:8080/api/room/list?page=' + page)
        .then((response) => response.json())
        .then((responseJson) => {
            this.state.rooms.push(...responseJson.rooms)
            this.setState({rooms: [...this.state.rooms]})
            this.setState({page: page})
        })

    }

    componentWillMount() {
        this._getRoomList()
    }
    componentWillUnmount() {
        // this.socket.disconnect()
        // alert('adf')
    }

    _onMore() {
        this._getRoomList()
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

    _renderItem({ item }) {
        return (
            <View key={item.id}>
                <Text>{item.index}</Text>
                <Text>{item.title}</Text>
                <Text>{item.creator}</Text>
            </View>
        )
    }

    _keyExtractor = (item, index) => item.id;

    render() {


        return (
            <View style={{flex: 1}}>
                <TouchableOpacity style={{height: 50}} onPress={() => this._onMore()}>
                    <Text>More</Text>
                </TouchableOpacity>
                <FlatList
                    style={styles.roomContainer}
                    data={this.state.rooms}
                    renderItem={this._renderItem}
                    keyExtractor={this._keyExtractor}
                    ref={ref => this.flatList = ref }
                />

            </View>
        )
    }
}


var styles = StyleSheet.create({
    roomContainer: {
        // flex: 1,
        // alignSelf: 'stretch',
        // flexGrow: 1,
        backgroundColor: '#00aaa5'
    }
})