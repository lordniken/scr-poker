import { makeReference, useApolloClient, useSubscription } from '@apollo/client';
import GameStatusChangedSubscription from './GameStatusChangedSubscription.graphql';
import GameUserJoinedSubscription from './GameUserJoinedSubscription.graphql';
import GameUserDisconnectedSubscription from './GameUserDisconnectedSubscription.graphql';

const useGameSubscriptions = () => {
  const { cache } = useApolloClient();

  useSubscription(GameStatusChangedSubscription, {
    onSubscriptionData: ({ subscriptionData: { data: { gameStatusChanged: status } } }) => {
      cache.modify({
        id: cache.identify(makeReference('ROOT_QUERY')),
        fields: {
          gameInfo(existing) {
            const gameInfo = { ...existing, status };

            return gameInfo;
          },
        },
        optimistic: true,
      });
    },
  });

  useSubscription(GameUserJoinedSubscription, {
    onSubscriptionData: ({ subscriptionData: { data: { userJoined } } }) => {
      cache.modify({
        id: cache.identify(makeReference('ROOT_QUERY')),
        fields: {
          gameInfo(existing) {
            const newOnlineList = new Set<string>([...existing.onlineList, userJoined]);
            const gameInfo = { ...existing, onlineList: [...Array.from(newOnlineList)] };
    
            return gameInfo;
          },
        },
        optimistic: true,
      });
    },
  });

  useSubscription(GameUserDisconnectedSubscription, {
    onSubscriptionData: ({ subscriptionData: { data: { userDisconnected } } }) => {
      cache.modify({
        id: cache.identify(makeReference('ROOT_QUERY')),
        fields: {
          gameInfo(existing) {
            const gameInfo = { ...existing, 
              onlineList: existing.onlineList.filter((user: string) => user !== userDisconnected) };
    
            return gameInfo;
          },
        },
        optimistic: true,
      });
    },
  });
};

export default useGameSubscriptions;
