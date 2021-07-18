/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeReference, useApolloClient, useLazyQuery, useSubscription } from '@apollo/client';
import { useGameIdSelector } from 'hooks';
import MeQuery from 'containers/Auth/MeQuery.graphql';
import GameStatusChangedSubscription from './GameStatusChangedSubscription.graphql';
import GameInfoQuery from './GameInfoQuery.graphql';
import GameVotesUpdated from './GameVotesUpdated.graphql';
import GameUpdateOnlineListSubscription from './GameUpdateOnlineListSubscription.graphql';

const useGameSubscriptions = () => {
  const client = useApolloClient();
  const gameId = useGameIdSelector();
  const [refreshGameInfo] = useLazyQuery(GameInfoQuery, {
    variables: {
      gameId,
    },
    fetchPolicy: 'network-only',
  });

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

  useSubscription(GameUpdateOnlineListSubscription, {
    variables: {
      gameId,
    },
    onSubscriptionData: ({ subscriptionData: { data: { updateOnlineList } } }) => {
      const { me: { id = null } = {} } = client.readQuery({
        query: MeQuery,
      }); 
      const isMeOnline = updateOnlineList.find((user: {id: string}) => user.id === id);
      if (!isMeOnline) {
        refreshGameInfo();
      }

      client.cache.modify({
        id: client.cache.identify(makeReference('ROOT_QUERY')),
        fields: {
          onlineList() {
            return updateOnlineList;
          },
        },
        optimistic: true,
      });
      client.cache.gc();
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
