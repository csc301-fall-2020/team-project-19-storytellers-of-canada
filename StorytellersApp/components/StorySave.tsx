import React, { Component, useEffect, useState } from 'react'
import { View, FlatList, Image, Text } from 'react-native';
import styles from "./styles";
import SavedStory from './SavedStory';
import { UserStoryType, StorySaveType, UserType } from "../types";
import axios from 'axios';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';

import * as Config from '../config';
import { Header } from 'react-native/Libraries/NewAppScreen';

let url = Config.HOST
type Props = {
  key: string;
  search: string;
  user: UserType | null | undefined;
}
type State = {
  stories: StorySaveType[],
  page: number,
  loading: boolean,
  sessionStart: string
};
export default class StorySave extends Component<Props, State> {

  private search: string;
  private user: UserType | null | undefined;
  constructor(props: Props) {
      super(props);
      this.search = props.search;
      this.user = props.user;
      this.state = {
          stories: [] as StorySaveType[],
          page: 1,
          loading: true,
          sessionStart: moment.utc().format('YYYY-MM-DD HH:mm:ss')
      };
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
      axios.get(url + 'stories', {
        params: {
          time: sessionStart,
          type: 'storysave',
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
  Header = () => {
    return (<View style={styles.storySaveHeader}>
      <View style={{ flex: 0.4 }}>
        <Image
          style={styles.topImage}
          source={{
            uri:
              "https://images.669pic.com/element_min_new_pic/22/30/24/59/e159482b59b7e920efe5a14140aaf28b.png",
          }}
        />
      </View>
      <View style={{ flex: 0.6 }}>
        <Text style={styles.storySaveTitle}>StorySave Collection</Text>
      </View>
    </View>
    );
  }

  componentDidMount() {
    this.fetchStories()
  };
  renderItem = ({ item }) => <SavedStory story={item} user={this.user}/>;
  render() {
    const { stories } = this.state;
    return (

      <FlatList
        ListHeaderComponent={<this.Header></this.Header>}
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
