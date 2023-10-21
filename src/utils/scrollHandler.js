import { useAnimatedScrollHandler } from 'react-native-reanimated';

  export const createScrollHandler = (scrollY) => {
    const clamp = (
        value,
        lowerBound,
        upperBound,
      ) => {
        'worklet';
        return Math.min(Math.max(lowerBound, value), upperBound);
      };
    return useAnimatedScrollHandler({
        onScroll: (event, ctx) => {
            let { y } = event.contentOffset;
            const maxY = event.contentSize.height - event.layoutMeasurement.height;
             if (y < 0) {
            y = 0;
          } else if (y > maxY) {
            y = maxY;
          }
      
          const dy = y - (ctx?.prevY ?? 0);
          scrollY.value = clamp(scrollY.value + dy, 0, 200);
          ctx.prevY = y;
          },
    });
  };