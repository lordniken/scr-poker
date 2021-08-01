/* eslint-disable @typescript-eslint/no-explicit-any */
import { makeReference, useApolloClient, useLazyQuery, useSubscription } from '@apollo/client';
import { debounce } from 'lodash-es';
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
    variables: {
      gameId,
    },
    onSubscriptionData: ({ subscriptionData: { data: { gameStatusChanged: status } } }) => {
      client.cache.modify({
        id: client.cache.identify(makeReference('ROOT_QUERY')),
        fields: {
          gameInfo(existing) {
            const votedScore = status.isVotingStarted ? existing.votedScore : null;
            const gameInfo = { ...existing, votedScore, status };

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
        debounce(refreshGameInfo, 1000)();
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
    variables: {
      gameId,
    },
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
