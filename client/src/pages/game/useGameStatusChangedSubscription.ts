import { makeReference, useApolloClient, useSubscription } from '@apollo/client';
import GameStatusChangedSubscription from './GameStatusChangedSubscription.graphql';

const useGameStatusChangedSubscription = () => {
  const { cache } = useApolloClient();

  useSubscription(GameStatusChangedSubscription, {
    onSubscriptionData: ({ subscriptionData: { data: { gameStatusChanged: status } } }) => {
      cache.modify({
        id: cache.identify(makeReference('ROOT_QUERY')),
        fields: {
          gameInfo(existing) {
            const newStatus = { ...existing, status };

            return newStatus;
          },
        },
        optimistic: true,
      });
    },
  });

};

export default useGameStatusChangedSubscription;
