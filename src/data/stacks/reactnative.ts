import { Question } from '../../types';

export const REACTNATIVE_QUESTIONS: Question[] = [
  {
    id: 'rn-1',
    stack: 'reactnative',
    topic: 'Mobile Architecture',
    title: 'How does React Native differ from React JS?',
    difficulty: 'Beginner',
    summary: 'React Native uses the same React paradigm but targets mobile OS APIs instead of the browser DOM.',
    explanation: [
      'No HTML/DOM: In React JS, you use `<div>`, `<span>`, `<p>`. In React Native, these do not exist. You use `<View>`, `<Text>`, `<Image>`, which map directly to actual native UI components (UIView on iOS, android.view.View on Android).',
      'Styling: No CSS files. Styling is done via JavaScript objects using the `StyleSheet` API (which heavily mimics Flexbox). Layout is strictly Flexbox.',
      'The Bridge: React Native runs your JavaScript logic in a background thread and communicates with the Native OS (Objective-C/Java) via an asynchronous "Bridge" to render the UI.'
    ],
    keyPoints: [
      'React JS targets the browser DOM. React Native targets Mobile OS Native UI APIs.',
      'React Native is NOT a WebView (unlike Cordova/Ionic). It renders real native UI elements, providing better performance.'
    ],
    tags: ['React Native', 'Mobile', 'Architecture']
  },
  {
    id: 'rn-2',
    stack: 'reactnative',
    topic: 'UI & Data Handling',
    title: 'Why should you use FlatList instead of ScrollView for large lists?',
    difficulty: 'Intermediate',
    summary: 'FlatList implements "virtualization" to manage memory efficiently, whereas ScrollView renders all its children at once, causing performance issues on large datasets.',
    explanation: [
      'ScrollView: Renders all child components immediately, even if they are off-screen. If you have 10,000 items, it creates 10,000 native views, instantly crashing the app due to OOM (Out of Memory).',
      'FlatList (Virtualization): Only renders the items that are currently visible on the screen (plus a small buffer). As the user scrolls, it recycles the off-screen views to display the new data coming on-screen.',
      'Required Props: FlatList requires `data` (the array) and `renderItem` (a function returning the component for each item).'
    ],
    codeExample: {
      language: 'tsx',
      filename: 'flatlist-demo.tsx',
      code: `import React from 'react';
import { FlatList, Text, View, StyleSheet } from 'react-native';

const DATA = Array.from({ length: 1000 }).map((_, i) => ({
  id: String(i),
  title: \`Item \${i}\`,
}));

export default function App() {
  return (
    <FlatList
      data={DATA}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Text>{item.title}</Text>
        </View>
      )}
      // Performance optimization props
      initialNumToRender={10}
      windowSize={5}
    />
  );
}

const styles = StyleSheet.create({
  item: { padding: 20, borderBottomWidth: 1 }
});`,
      output: `Renders a smooth 60fps scrolling list of 1000 items without memory bloat`,
      executionSteps: [
        { line: 11, explanation: 'Pass the array of 1000 items to the data prop' },
        { line: 12, explanation: 'keyExtractor tells FlatList how to uniquely identify each item for recycling' },
        { line: 13, explanation: 'renderItem only executes for the ~10 items currently visible on screen' }
      ]
    },
    keyPoints: [
      'Always use `keyExtractor`. It is the equivalent of the `key` prop in React mapping.',
      'If your items have complex layouts, use `React.memo` on the rendered item component to prevent unnecessary re-renders during scrolling.'
    ],
    tags: ['React Native', 'FlatList', 'Performance', 'UI']
  },
  {
    id: 'rn-3',
    stack: 'reactnative',
    topic: 'Advanced Architecture',
    title: 'Explain the Old Architecture (The Bridge) vs the New Architecture (JSI / Fabric).',
    difficulty: 'Advanced',
    summary: 'The Old Architecture relied on asynchronous JSON serialization over a Bridge. The New Architecture uses JSI to allow JavaScript and Native code to communicate directly and synchronously.',
    explanation: [
      'The Old Bridge: The JS thread and the Native UI thread were completely isolated. They communicated by serializing data to JSON, passing it over an asynchronous "bridge", and parsing it on the other side. This was slow and caused bottleneck stuttering during heavy animations or fast scrolling.',
      'The New Architecture (JSI): JavaScript Interface (JSI) replaces the Bridge. It allows JavaScript to hold references to C++ native objects and invoke methods on them synchronously, without JSON serialization.',
      'Fabric (New UI Manager): Built on top of JSI, it allows React Native to render UI synchronously, perfectly aligning with React 18 Concurrent Features.',
      'TurboModules: Replaces old Native Modules. Modules are now loaded lazily (only when needed) via JSI, drastically improving app startup time.'
    ],
    keyPoints: [
      'The New Architecture solves the "blank space on fast scroll" issue in FlatList.',
      'JSI uses C++ as the common language between the JS engine (Hermes) and the Native OS.'
    ],
    interviewTip: 'Understanding the shift from the Asynchronous JSON Bridge to Synchronous JSI is the most important architectural concept for a Senior React Native role.',
    tags: ['React Native', 'Architecture', 'JSI', 'Fabric', 'Advanced']
  },
  {
    id: 'rn-4',
    stack: 'reactnative',
    topic: 'Advanced Architecture',
    title: 'What are Native Modules and when would you need them?',
    difficulty: 'Advanced',
    summary: 'Native Modules allow JavaScript to execute custom Objective-C/Swift (iOS) or Java/Kotlin (Android) code when React Native does not have a built-in API for a specific device feature.',
    explanation: [
      'Use Case: React Native provides APIs for basic things (Camera, Geolocation, Storage). However, if you need to integrate a proprietary 3rd-party SDK, execute heavy image processing using C++, or access a very new OS-specific feature, you must write a Native Module.',
      'How it works: You write the native code in Xcode (iOS) and Android Studio, expose it via specific React Native macros/annotations, and then import it directly into your JavaScript code as a module.'
    ],
    keyPoints: [
      'Writing Native Modules requires knowledge of iOS and Android native development.',
      'Expo helps avoid writing Native Modules by providing a massive standard library, but for highly custom apps, "ejecting" from Expo or using bare React Native is required.'
    ],
    tags: ['React Native', 'Native Modules', 'Advanced', 'Mobile']
  }
];
