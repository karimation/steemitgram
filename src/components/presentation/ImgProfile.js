import React, { Component } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Platform,
    ActivityIndicator
} from 'react-native';

import ImageView from 'react-native-image-view';

const { width } = Dimensions.get('window');

export default class ImgProfile extends Component {
    constructor(props) {
        super(props)

        this.state = {
            data: [],
            loading:true,
            imageIndex: 0,
            isImageViewVisible: false,
            likes: null,
            username: this.props.username
        };

        this.renderFooter = this.renderFooter.bind(this);
    }

    async fetchData(username) {
        const uri = "https://steemend.herokuapp.com/api/users/getUserPosts";
        const response = await fetch(
            `${uri}/${username}`
        );
        const jsondata = await response.json();
        //console.log('js: '+jsondata)
        return jsondata;
    }

    async loadData(username) {
        const data = await this.fetchData(username);
        //const formatedData = this.fromArrayToSectionData(data);
        this.setState({
            loading:false,
            data: [...this.state.data, ...data],
            likes: data.reduce((acc, image) => {
                acc[image.id] = image.net_votes;
                return acc;
            }, {}),
        });
    }

    async componentDidMount() {
        await this.loadData(this.state.username);
    }

    renderFooter({ title, id, pending_payout_value }) {
        const { likes } = this.state;
        return (
            <View style={styles.footer}>
                <View>
                    <Text style={styles.footerText}>{title}</Text>
                    <Text style={styles.footerText}></Text>
                    <Text style={[styles.footerText, { marginLeft: 7 }]}>
                    ♥  {likes[id]} 
                    </Text>
                    <Text style={[styles.footerText, { marginLeft: 7 }]}>
                     {pending_payout_value}
                    </Text>
                </View>
            </View>
        );
    }

    render() {

        const { isImageViewVisible, imageIndex, data,loading } = this.state;
        //console.log('img index: ' + imageIndex)
        if (loading) {
            return (
                <ActivityIndicator size="large" color="#0000ff" />
            )
        } else {
            if (data.length === 0) {
                return <View style={styles.msg}><Text>No posts yet</Text></View>
            }
            return (
                <View style={styles.container}>
                    <View>
                        {this.state.data.map((image, index) => (
                            <TouchableOpacity
                                key={image.id}
                                onPress={() => {
                                    this.setState({
                                        imageIndex: index,
                                        isImageViewVisible: true,
                                    });
                                }}
                            >
                                <Image
                                    style={{ width, height: 200 }}
                                    source={image.source}
                                    resizeMode="cover"
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
                    <ImageView
                        glideAlways
                        images={this.state.data}
                        imageIndex={imageIndex}
                        animationType="fade"
                        isVisible={isImageViewVisible}
                        renderFooter={this.renderFooter}
                    />
                </View>
            );
        }
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingTop: Platform.select({ ios: 0, android: 10 }),
    },
    msg: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width,
        height: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    footerButton: {
        flexDirection: 'row',
        marginLeft: 15,
    },
    footerText: {
        fontSize: 16,
        color: '#FFF',
        textAlign: 'center',
    },
});
