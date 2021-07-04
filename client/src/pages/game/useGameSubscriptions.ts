/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeReference, useApolloClient, useSubscription } from '@apollo/client';
import { useGameIdSelector } from 'hooks';
import GameStatusChangedSubscription from './GameStatusChangedSubscription.graphql';
import GameUserJoinedSubscription from './GameUserJoinedSubscription.graphql';
import GameUserDisconnectedSubscription from './GameUserDisconnectedSubscription.graphql';
import GameInfoQuery from './GameInfoQuery.graphql';
import GameVotesUpdated from './GameVotesUpdated.graphql';

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

      client.cache.modify({
        id: `Storie:${status.votingStorieId}`,
        fields: {
          isVoted() {
            return !status.isVotingStarted;
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
      const isAlreadyOnline = !!gameInfo.onlineList.find((user: any) => user.id === userJoined.id);
      const newOnlineList = isAlreadyOnline ? gameInfo.onlineList : [
        ...gameInfo.onlineList, 
        {
          id: userJoined.id,
          username: userJoined.username,
          __typename: 'User',
        },
      ];

      client.writeQuery({
        query: GameInfoQuery,
        data: { 
          gameInfo: {
            ...gameInfo,
            onlineList: newOnlineList,
          },
        },
        variables: {
          gameId,
        },
      });
    },
  });

  useSubscription(GameUserDisconnectedSubscription, {
    variables: {
      gameId,
    },
    onSubscriptionData: ({ subscriptionData: { data: { userDisconnected } } }) => {
      client.cache.modify({
        id: client.cache.identify(makeReference('ROOT_QUERY')),
        fields: {
          gameInfo(existing) {
            const gameInfo = { ...existing, 
              onlineList: existing.onlineList?.filter((user: any) => user.__ref !== `User:${userDisconnected}`) };

            client.cache.gc();
    
            return gameInfo;
          },
        },
        optimistic: true,
      });
    },
  });

  useSubscription(GameVotesUpdated, {
    onSubscriptionData: ({ subscriptionData: { data: { updateUserVotes } } }) => {
      client.cache.modify({
        id: client.cache.identify(makeReference('ROOT_QUERY')),
        fields: {
          gameInfo(existing) {
            const gameInfo = { 
              ...existing, 
              status: {
                ...existing.status,
                votedUsers: updateUserVotes,
              },
            };

            return gameInfo;
          },
        },
        optimistic: true,
      });
    },
  });
  
};

export default useGameSubscriptions;
