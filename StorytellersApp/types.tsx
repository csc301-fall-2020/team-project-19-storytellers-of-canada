export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  Home: undefined;
  StoredStories: undefined;
};

export type HomeNavigatorParamList = {
  HomeScreen: undefined;
};

export type TabTwoParamList = {
  TabTwoScreen: undefined;
};

export type UserType = {
  id: number,
  username: string,
  image?: string,
}

export type UserStoryType = {
  id: number,
  user: UserType,
  creationTime: string,
  title: string,
  description: string,
  recording: string,
  numberOfReplies?: number,
  numberOfLikes?: number,
};



