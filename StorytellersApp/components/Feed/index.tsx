import React, { Component, useEffect, useState } from 'react'
import { View, FlatList } from 'react-native';

import userstories from '../../data/userstoriestest';
import UserStory from '../UserStory';
import { UserStoryType, UserType } from "../../types";
import axios from 'axios';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';

import * as Config from '../../config';

let url = Config.HOST //local ip address 
type Props = {
    key: string;
    search: string;
    user: UserType | null | undefined;
}
type State = {
    stories: UserStoryType[],
    page: number,
    loading: boolean,
    sessionStart: string
};

export default class Feed extends Component<Props, State> {
    private search: string;
    private user: UserType | null | undefined;
    constructor(props: Props) {
        super(props);
        this.search = props.search;
        this.user = props.user;
        this.state = {
            stories: [] as UserStoryType[],
            page: 1,
            loading: true,
            sessionStart: moment.utc().format('YYYY-MM-DD HH:mm:ss')
        };
    };
    componentDidMount() {
        this.fetchStories();
    };

    fetchStories = async () => {
        const { page } = this.state;
        const { stories } = this.state;
        const { sessionStart } = this.state;
        const username = this.user === null || this.user === undefined ? undefined : this.props.user?.username;
        this.setState({
            loading: true
        });

        try {

            //get stories from backend
            // let story_arr = userstories as UserStoryType[];
            axios.get(url + 'stories', {
                params: {
                    time: sessionStart,
                    type: 'userstory',
                    filter: this.search == '' || this.search == null || this.search == undefined ? null : this.search,
                    username: username,
                    page: page
                }
            })
                .then(response => {
                    this.setState({
                        stories:
                            page === 1
                                ? Array.from(response.data.stories === undefined ? [] : response.data.stories)
                                : response.data.stories === undefined ? this.state.stories : [...this.state.stories, ...response.data.stories],
                    }
                    );
                })
                .catch((error) => {
                    console.error(error);
                });
        } catch (e) {

        } finally {
            this.setState({
                loading: false
            });


        }
    }


    loadMore = async () => {
        if (!this.state.loading) {
            this.setState(
                (prevState: any) => ({
                    page: prevState.page + 1,
                }),
                () => {
                    this.fetchStories();
                }
            );
        }
    };


    refresh = async () => {
        this.setState(
            {
                page: 1,
                stories: [],
                sessionStart: moment.utc().format('YYYY-MM-DD HH:mm:ss')
            }
            ,
            () => {
                this.fetchStories();
            }
        );
    };

    renderItem = ({ item }) => <UserStory story={item} user={this.user}/>;
    render() {
        const { stories } = this.state;
        return (
            <FlatList
                data={stories}
                renderItem={this.renderItem}
                keyExtractor={item => item.id.toString()}
                refreshing={this.state.loading}
                onRefresh={this.refresh}
                onEndReached={this.loadMore}
                onEndReachedThreshold={0.5}
            />
        )
    };

}
