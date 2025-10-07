// HorizontalDateList.tsx
import React, { useRef, useEffect } from "react";
import { FlatList } from "react-native";
import { DayTile, styles } from "./DayTile";
import moment from "moment";

// Constants from DayTile
const DAY_WIDTH = 65;
const DAY_MARGIN_RIGHT = 10;
const ITEM_LENGTH = DAY_WIDTH + DAY_MARGIN_RIGHT;

interface DayItem {
  dateKey: string;
  dayOfWeek: string;
  dayOfMonth: number;
  isAvailable: boolean;
}

interface HorizontalDateListProps {
  monthDays: DayItem[];
  selectedDate: string;
  onSelectDate: (dateKey: string) => void;
  initialScrollDate: string;
  targetMonth: moment.Moment;
}

export const HorizontalDateList: React.FC<HorizontalDateListProps> = ({
  monthDays,
  selectedDate,
  onSelectDate,
  initialScrollDate,
  targetMonth,
}) => {
  const flatListRef = useRef<FlatList<DayItem>>(null);

  useEffect(() => {
    if (monthDays.length === 0) return;

    const isPastOrCurrentMonth = targetMonth.isSameOrBefore(moment(), "month");

    let indexToScroll = -1;

    if (isPastOrCurrentMonth) {
      if (initialScrollDate) {
        indexToScroll = monthDays.findIndex((day) => day.dateKey === initialScrollDate);
      }
    } else {
      indexToScroll = 0;
    }

    if (indexToScroll !== -1) {
      flatListRef.current?.scrollToIndex({
        index: indexToScroll,
        animated: false,
        viewPosition: 0.5,
      });
    }
  }, [monthDays.length, targetMonth]);

  const getItemLayout = (data: any, index: number) => ({
    length: ITEM_LENGTH,
    offset: ITEM_LENGTH * index,
    index,
  });

  return (
    <FlatList
      ref={flatListRef}
      data={monthDays}
      keyExtractor={(item) => item.dateKey}
      renderItem={({ item }) => (
        <DayTile day={item} isSelected={item.dateKey === selectedDate} onPress={onSelectDate} />
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalListContainer}
      getItemLayout={getItemLayout}
      initialScrollIndex={0}
    />
  );
};
