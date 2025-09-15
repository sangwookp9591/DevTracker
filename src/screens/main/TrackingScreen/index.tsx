import React from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { commonStyles } from '../../../styles';

const TrackingScreen: React.FC = () => {
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // await loadInitialData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View>
          <Text>TrackingScreen</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TrackingScreen;
