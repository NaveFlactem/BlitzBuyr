import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const Feed = () => {
  // Define an array of colors
  const colors = ['#FF5733', '#33FFA2', '#3373FF', '#FFE333', '#E333FF'];

  return (
    <Swiper style={styles.wrapper} showsPagination={false}>
      {colors.map((color, index) => (
        <View key={index} style={[styles.slide, { backgroundColor: color }]}>
          <Text style={styles.colorText}>{color}</Text>
        </View>
      ))}
    </Swiper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    // styles for the Swiper component
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorText: {
    fontSize: 24,
    color: 'white',
  },
});

export default Feed;






// import React, { useEffect, useRef, useState } from 'react'
// import { Dimensions, FlatList, View } from 'react-native'
// import useMaterialNavBarHeight from '../../hooks/useMaterialNavBarHeight'
// import PostSingle from '../../components/general/post'
// import { getFeed, getPostsByUserId } from '../../services/posts'
// import { StyleSheet } from 'react-native'
// const { StyleSheet } = require('react-native');

// const screenWidth = Dimensions.get('window').width;
// const screenHeight = Dimensions.get('window').height;

// const styles = StyleSheet.create({
//     container: { 
//         alignItems: 'center',
//         justifyContent: 'center',
//         zIndex: 0,
//     },
//     listing: {
//         height: 0.6 * screenHeight,
//         width: 0.7 * screenWidth,
//     }
// })

// /**
//  * Component that renders a list of posts meant to be 
//  * used for the feed screen.
//  * 
//  * On start make fetch for posts then use a flatList 
//  * to display/control the posts.
//  */
// export default function FeedScreen({ route }) {
//     const { setCurrentUserProfileItemInView, creator, profile } = route.params
//     const [posts, setPosts] = useState([])
//     const mediaRefs = useRef([])

//     useEffect(() => {
//         if (profile) {
//             getPostsByUserId(creator).then(setPosts)
//         } else {
//             getFeed().then(setPosts)
//         }
//     }, [])


//     /**
//      * Called any time a new post is shown when a user scrolls
//      * the FlatList, when this happens we should start playing 
//      * the post that is viewable and stop all the others
//      */
//     const onViewableItemsChanged = useRef(({ changed }) => {
//         changed.forEach(element => {
//             const cell = mediaRefs.current[element.key]
//             if (cell) {
//                 if (element.isViewable) {
//                     if (!profile) {
//                         setCurrentUserProfileItemInView(element.item.creator)
//                     }
//                     cell.play()
//                 } else {
//                     cell.stop()
//                 }
//             }

//         });
//     })

//     const feedItemHeight = Dimensions.get('window').height - useMaterialNavBarHeight(profile);
//     /**
//      * renders the item shown in the FlatList
//      * 
//      * @param {Object} item object of the post 
//      * @param {Integer} index position of the post in the FlatList 
//      * @returns 
//      */
//     const renderItem = ({ item, index }) => {
//         return (
//             <View style={{ height: feedItemHeight, backgroundColor: 'black' }}>
//                 <PostSingle item={item} ref={PostSingleRef => (mediaRefs.current[item.id] = PostSingleRef)} />
//             </View>
//         )
//     }

//     return (
//         <View style={styles.container}>
//             <FlatList
//                 data={posts}
//                 windowSize={4}
//                 initialNumToRender={0}
//                 maxToRenderPerBatch={2}
//                 removeClippedSubviews
//                 viewabilityConfig={{
//                     itemVisiblePercentThreshold: 0
//                 }}
//                 renderItem={renderItem}
//                 pagingEnabled
//                 keyExtractor={item => item.id}
//                 decelerationRate={'normal'}
//                 onViewableItemsChanged={onViewableItemsChanged.current}
//             />
//         </View>
//     )
// }

