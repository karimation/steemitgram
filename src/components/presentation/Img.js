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

export default class Img extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            imageIndex: 0,
            isImageViewVisible: false,
            likes: null
        };

        this.renderFooter = this.renderFooter.bind(this);
    }

    async fetchData(username) {
        const uri = "https://steemend.herokuapp.com/api/users/getUserPosts";
        const response = await fetch(
            `${uri}/${username}`
        );
        const jsondata = await response.json();
        return jsondata;
    }

    async loadData(username) {
        const data = await this.fetchData(username);
        //const formatedData = this.fromArrayToSectionData(data);
        this.setState({
            data: [...this.state.data, ...data],
            likes: data.reduce((acc, image) => {
                acc[image.id] = image.net_votes;
                return acc;
            }, {}),
        });
    }

    async componentDidMount() {
        await this.loadData('borepstein');
    }

    renderFooter({ title, id }) {
        const { likes } = this.state;
        return (
            <View style={styles.footer}>
                <Text style={styles.footerText}>{title}</Text>
                <TouchableOpacity
                    style={styles.footerButton}
                    onPress={() => {
                        const imageLikes = likes[title] + 1;
                        this.setState({ likes: { ...likes, [id]: imageLikes } });
                    }}
                >
                    <Text style={styles.footerText}>♥</Text>
                    <Text style={[styles.footerText, { marginLeft: 7 }]}>
                        {likes[id]}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    render() {

        const { isImageViewVisible, imageIndex, data } = this.state;
        console.log('img index: ' + imageIndex)
        if (data.length === 0) {
            return (
                <ActivityIndicator />
            )
        } else {
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


const images = [
    {
        source: {
            uri:
                'https://avatars.mds.yandex.net/get-pdb/49816/d9152cc6-bf48-4e44-b2d5-de73b2e94454/s800',
        },
        title: 'London',
    },
    {
        // eslint-disable-next-line
        source: {
            uri:
                'https://avatars.mds.yandex.net/get-pdb/49816/d9152cc6-bf48-4e44-b2d5-de73b2e94454/s800',
        }, title: 'St-Petersburg',
        width: 1200,
        height: 800,
    },
    {
        source: {
            uri:
                'https://cdn.pixabay.com/photo/2017/08/17/10/47/paris-2650808_960_720.jpg',
        },
        title: 'Paris',
        width: 806,
        height: 720,
    },
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingTop: Platform.select({ ios: 0, android: 10 }),
    },
    footer: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width,
        height: 50,
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
