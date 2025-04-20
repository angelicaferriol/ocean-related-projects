import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';

interface Reminder {
  id: number;
  category: 'water' | 'plastic' | 'energy' | 'waste';
  shortMessage: string;
  longTip: string;
}

const allReminders: Reminder[] = [
  { id: 1, category: 'water', shortMessage: 'Turn off the tap while brushing your teeth.', longTip: 'Leaving the tap running can waste over 6 liters of water per minute. Turning it off saves a significant amount!' },
  { id: 2, category: 'plastic', shortMessage: 'Remember your reusable shopping bag!', longTip: 'Plastic bags take hundreds of years to decompose and harm wildlife. Reusable bags are a great alternative.' },
  { id: 3, category: 'energy', shortMessage: 'Unplug chargers when not in use.', longTip: 'Many electronics draw "phantom power" even when off or fully charged. Unplugging them saves energy and money.' },
  { id: 4, category: 'waste', shortMessage: 'Consider composting fruit & veggie scraps.', longTip: 'Composting reduces landfill waste and creates nutrient-rich soil for your garden.' },
  { id: 5, category: 'water', shortMessage: 'Try taking a slightly shorter shower today.', longTip: 'Reducing your shower time by just a few minutes can save gallons of water each day.' },
  { id: 6, category: 'plastic', shortMessage: 'Choose products with minimal packaging.', longTip: 'Excess packaging contributes significantly to waste. Look for loose items or eco-friendly packaging options.' },
  { id: 7, category: 'energy', shortMessage: 'Switch to LED bulbs when possible.', longTip: 'LED bulbs use up to 80% less energy and last much longer than traditional incandescent bulbs.' },
  { id: 8, category: 'waste', shortMessage: 'Refuse single-use straws and cutlery.', longTip: 'Carry your own reusable alternatives or simply opt out when dining out or getting takeout.' },
];

const getCategoryIcon = (category: 'water' | 'plastic' | 'energy' | 'waste') => {
  const baseClass = "rounded-xl w-16 h-16 items-center justify-center border-2 border-dashed";
  switch (category) {
    case 'water':
      return (
        <View className={`bg-blue-100 border-blue-300 ${baseClass}`}>
          <Text className="text-blue-600 text-xs text-center">Water</Text>
        </View>
      );
    case 'plastic':
      return (
        <View className={`bg-orange-100 border-orange-300 ${baseClass}`}>
          <Text className="text-orange-600 text-xs text-center">Plastic</Text>
        </View>
      );
    case 'energy':
      return (
        <View className={`bg-yellow-100 border-yellow-300 ${baseClass}`}>
          <Text className="text-yellow-600 text-xs text-center">Energy</Text>
        </View>
      );
    case 'waste':
      return (
        <View className={`bg-green-100 border-green-300 ${baseClass}`}>
          <Text className="text-green-600 text-xs text-center">Waste</Text>
        </View>
      );
    default:
      return <View className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />;
  }
};

const EcoReminderScreen: React.FC = () => {
  const [currentReminder, setCurrentReminder] = useState<Reminder | null>(null);
  const [showTip, setShowTip] = useState<boolean>(false);

  const generateNewReminder = () => {
    let newReminder: Reminder;
    do {
      const randomIndex = Math.floor(Math.random() * allReminders.length);
      newReminder = allReminders[randomIndex];
    } while (newReminder.id === currentReminder?.id && allReminders.length > 1);

    setCurrentReminder(newReminder);
    setShowTip(false);
  };

  useEffect(() => {
    generateNewReminder();
  }, []);

  return (
    <ScrollView className="flex-1 bg-green-50 p-4">
      {/* Reminder Card */}
      <View className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <Text className="text-2xl font-bold text-green-800 mb-4 text-center">Eco Tip of the Moment</Text>

        {currentReminder ? (
          <View className="items-center">
            <View className="mb-4">{getCategoryIcon(currentReminder.category)}</View>
            <Text className="text-lg text-gray-700 text-center mb-6">{currentReminder.shortMessage}</Text>

            {showTip && (
              <View className="bg-green-100 p-4 rounded-md mb-6 w-full">
                <Text className="text-sm font-semibold text-green-900 mb-1">Learn More:</Text>
                <Text className="text-sm text-green-800">{currentReminder.longTip}</Text>
              </View>
            )}

            <View className="flex-row justify-center space-x-4 w-full">
              <TouchableOpacity
                onPress={() => setShowTip(!showTip)}
                className={`py-2 px-4 rounded ${showTip ? 'bg-yellow-500' : 'bg-blue-500'}`}
              >
                <Text className="text-white font-semibold">{showTip ? 'Hide Tip' : 'Learn More'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={generateNewReminder}
                className="bg-green-600 py-2 px-4 rounded"
              >
                <Text className="text-white font-semibold">Next Tip</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text className="text-center text-gray-500">Loading reminder...</Text>
        )}
      </View>

      {/* Log Section */}
      <View className="bg-white rounded-xl shadow-lg p-6">
        <Text className="text-xl font-bold text-green-800 mb-4 text-center">Log Your Eco Action!</Text>
        <View className="space-y-3">
          <TouchableOpacity className="bg-blue-100 p-3 rounded-md border border-blue-300">
            <Text className="text-blue-800 text-center">💧 Used Less Water</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-orange-100 p-3 rounded-md border border-orange-300">
            <Text className="text-orange-800 text-center">🛍️ Avoided Plastic</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-yellow-100 p-3 rounded-md border border-yellow-300">
            <Text className="text-yellow-800 text-center">💡 Saved Energy</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-green-100 p-3 rounded-md border border-green-300">
            <Text className="text-green-800 text-center">♻️ Reduced Waste</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-xs text-gray-500 mt-4 text-center">(Action logging is illustrative)</Text>
      </View>
    </ScrollView>
  );
};

export default EcoReminderScreen;