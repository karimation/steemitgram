/*
 * @Author: kerim-selmi, karimation 
 * @Date: 2018-05-21 10:31:42 
 * @Last Modified by: kerim-selmi, karimation
 * @Last Modified time: 2018-06-06 12:57:01
 */

import React, { PureComponent } from 'react';
import { Text, View, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking, FlatList } from 'react-native'
import config from '../config/index'

export default class Profile extends PureComponent {


    /**fake profile pictures */
    constructor() {
        super();
        this.state = {
            profilePics: [],
            location: null,
            coverImage: null,
            imgprofil: null
        };

    }

    static navigationOptions = {
        tabBarIcon: ({ tintColor }) => (
            <Image
                source={config.images.profile}
                style={[styles.barIcon, { tintColor: tintColor }]}
            />
        ),
    }

    async componentDidMount() {
        const username = 'borepstein'//this.props.username
        await this.loadData(username);
        this.setState({
            imgprofil: `https://steemitimages.com/u/${username}/avatar`,
        });
    }

    /**
     * 
     * @param {String} username 
     * return user follows count
     */
    async getFollowCount(username) {
        const uri = "https://steemend.herokuapp.com/api/users/getFollowCount";
        const response = await fetch(
            `${uri}/${username}`
        );
        const jsondata = await response.json();
        return jsondata;
    }
    /**
     * 
     * @param {String} username 
     * return user profile from steemend api
     */
    async getUserProfile(username) {
        const uri = "https://steemend.herokuapp.com/api/users/profile";
        const response = await fetch(
            `${uri}/${username}`
        );
        const jsondata = await response.json();
        return jsondata;
    }

    /**
     * 
     * @param {String} username 
     * return user posts from steemEnd api
     */
    async getUserPosts(username) {
        const uri = "https://steemend.herokuapp.com/api/users/getUserPosts";
        const response = await fetch(
            `${uri}/${username}`
        );
        const jsondata = await response.json();
        //console.log('user: ' + JSON.stringify(jsondata))
        return jsondata;
    }

    async loadData(username) {
        const followCount = await this.getFollowCount(username);
        const user = await this.getUserProfile(username);
        const posts = await this.getUserPosts(username);
        this.setState({
            follower: followCount.follower_count,
            following: followCount.following_count,
            location: user.location,
            website: user.website,
            posts: user.post_count,
            power: user.voting_power
        });
        //console.log('posts:  '+posts)
        this.setState({
            profilePics: posts
        })
    }

    GetItem(flower_name) {

        Alert.alert(flower_name);

    }

    FlatListItemSeparator = () => {
        return (
            <View
                style={{
                    height: .5,
                    width: "100%",
                    backgroundColor: "#000",
                }}
            />
        );
    }

    render() {
        return (
            <ScrollView>
                <View style={{ flex: 1, width: 100 + '%', height: 100 + '%', paddingTop: 20 }}>
                    <View style={styles.profileInfo} >
                        <View style={{ flexDirection: 'row', width: 100 + '%' }} >
                            <View style={styles.userContainerPicture} >
                                <Image
                                    style={styles.userPicture}
                                    source={{ uri: this.state.imgprofil }}
                                />
                            </View>
                            <View style={{ flex: 7, height: 100 }} >
                                <View style={{ flexDirection: 'row', flex: 1 }} >
                                    <View style={styles.statCol}>
                                        <Text>{this.state.posts}</Text>
                                        <Text>Posts</Text>
                                    </View>
                                    <View style={styles.statCol}>
                                        <Text>{this.state.follower}</Text>
                                        <Text>Followers</Text>
                                    </View>
                                    <View style={styles.statCol}>
                                        <Text>{this.state.following}</Text>
                                        <Text>Following</Text>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.editPro} onPress={() => { Alert.alert('soon: edit interface') }} >
                                    <View style={styles.editPro} >
                                        <Text>Edit Profile</Text>
                                    </View>
                                </TouchableOpacity>

                            </View>
                        </View>
                        <View style={styles.nameDisplay} >
                            <Text style={styles.title}>{this.props.username}</Text>
                        </View>
                        <View style={styles.info} >
                            <Image style={styles.icon} source={config.images.location} />
                            <Text> {this.state.location} </Text>
                            <Image style={styles.icon} source={config.images.website} />
                            <TouchableOpacity style={styles.clickbtn} onPress={() => { Linking.openURL(this.state.website) }} >
                                <Text> {this.state.website} </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.clickbtn} onPress={() => { Alert.alert('Your vote power is ' + this.state.power) }} >
                                <Image style={styles.icon} source={config.images.power} />
                                <Text> {this.state.power} </Text>
                            </TouchableOpacity>

                        </View >
                    </View>
                    {/*<View style={styles.profilePicContainer} >
                        {this.state.profilePics.map((pic, i) => {
                            console.log('pic: ' + pic.id)
                            return (
                                <Image
                                    key={pic.id}
                                    style={styles.profilePicThumb}
                                    source={{ uri: pic.body[0] }}
                                />
                            )
                        })}
                    </View> */}
                    <FlatList
                        data={this.state.profilePics}
                        ItemSeparatorComponent={this.FlatListItemSeparator}
                        renderItem={({ item }) =>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <Image source={{ uri: item.body[0] }} style={styles.imageView} />
                                <Text onPress={this.GetItem.bind(this, item.id)} style={styles.textView} >{item.author}</Text>
                            </View>
                        }
                        keyExtractor={(item, index) => index.toString()}
                    />


                </View>
            </ScrollView>
        )
    }
}


const styles = StyleSheet.create({
    profilePicContainer: {
        width: 100 + '%',
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#efefef',
    },
    barIcon: {
        width: 26,
        height: 26,
    },
    profilePicThumb: {
        width: config.styleConstants.halfWidth,
        height: config.styleConstants.halfWidth,
    },
    profileInfo: {
        width: 100 + '%',
        //height: config.styleConstants.screenHeight / 3,
        display: 'flex',
        flexDirection: 'column',
        //backgroundColor: '#655655',
        paddingVertical: 20
    },
    fontBold: {
        fontWeight: 'bold',
        fontSize: 16,
        paddingVertical: 40

    },
    userContainerPicture: {
        flex: 3,
        height: 100,
        //backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center'
    },
    userPicture: {
        height: 80,
        borderRadius: 40,
        width: 80
    },
    statCol: {
        flexDirection: 'column',
        flex: 1
    },
    editPro: {
        width: 100 + '%',
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#efefef',
        borderRadius: 5,
    },
    clickbtn: {
        flexDirection: 'row',
        flex: 1,
    },
    nameDisplay: {
        flexDirection: 'column',
        width: 100 + '%',
        paddingLeft: 20,
        //backgroundColor: 'yellow',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 30,
        paddingLeft: 5

    },
    info: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 20
    },
    icon: {
        height: 20,
        width: 20,
    },
    imageView: {
        width: '70%',
        height: 100,
        margin: 7,
        borderRadius: 7
    },
    textView: {
        width: '50%',
        textAlignVertical: 'center',
        padding: 10,
        color: '#000'
    }

});
