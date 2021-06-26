/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeReference, useApolloClient, useSubscription } from '@apollo/client';
import { useGameIdSelector } from 'hooks';
import GameStatusChangedSubscription from './GameStatusChangedSubscription.graphql';
import GameUserJoinedSubscription from './GameUserJoinedSubscription.graphql';
import GameUserDisconnectedSubscription from './GameUserDisconnectedSubscription.graphql';
import GameInfoQuery from './GameInfoQuery.graphql';

const useGameSubscriptions = () => {
  const client = useApolloClient();
  const gameId = useGameIdSelector();

  useSubscription(GameStatusChangedSubscription, {
    onSubscriptionData: ({ subscriptionData: { data: { gameStatusChanged: status } } }) => {
      client.cache.modify({
        id: client.cache.identify(makeReference('ROOT_QUERY')),
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
      const data = client.readQuery({ 
        query: GameInfoQuery,
        variables: {
          gameId,
        },
      });
  
      if (!data) {
        return;
      }
      
      const { gameInfo } = data;

      client.writeQuery({
        query: GameInfoQuery,
        data: { 
          gameInfo: {
            ...gameInfo,
            onlineList: [
              ...gameInfo.onlineList,
              {
                id: userJoined.id,
                username: userJoined.username,
                __typename: 'User',
              },
            ],
          },
        },
        variables: {
          gameId,
        },
      });
    },
  });

  useSubscription(GameUserDisconnectedSubscription, {
    onSubscriptionData: ({ subscriptionData: { data: { userDisconnected } } }) => {
      client.cache.modify({
        id: client.cache.identify(makeReference('ROOT_QUERY')),
        fields: {
          gameInfo(existing) {
            const gameInfo = { ...existing, 
              onlineList: existing.onlineList.filter((user: any) => user.__ref !== `User:${userDisconnected}`) };

            client.cache.gc();
    
            return gameInfo;
          },
        },
        optimistic: true,
      });
    },
  });
};

export default useGameSubscriptions;
