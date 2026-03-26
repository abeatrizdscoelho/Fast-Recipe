import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,
  Dimensions, FlatList, ListRenderItemInfo } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { fonts } from '../theme/typography';
import { colors } from '../theme/color';

const { width, height } = Dimensions.get('window')

interface Slide {
  id: string
  title: string
  description: string
  icon: React.ReactNode
}

function ExploreIcon() {
  return (
    <Svg width={80} height={80} viewBox="0 0 80 80" fill="none">
      <Circle cx="36" cy="36" r="22" stroke="#DDBC9B" strokeWidth="3.5"/>
      <Line x1="52" y1="52" x2="68" y2="68" stroke="#DDBC9B" strokeWidth="3.5" strokeLinecap="round"/>
      <Line x1="28" y1="36" x2="44" y2="36" stroke="#DDBC9B" strokeWidth="3" strokeLinecap="round"/>
      <Line x1="36" y1="28" x2="36" y2="44" stroke="#DDBC9B" strokeWidth="3" strokeLinecap="round"/>
    </Svg>
  )
}

function IdeaIcon() {
  return (
    <Svg width={80} height={80} viewBox="0 0 80 80" fill="none">
      <Path d="M40 12 C28 12 20 20 20 31 C20 38 24 44 30 47 L30 56 L50 56 L50 47 C56 44 60 38 60 31 C60 20 52 12 40 12Z" stroke="#DDBC9B" strokeWidth="3.5" strokeLinejoin="round"/>
      <Line x1="30" y1="62" x2="50" y2="62" stroke="#DDBC9B" strokeWidth="3" strokeLinecap="round"/>
      <Line x1="33" y1="68" x2="47" y2="68" stroke="#DDBC9B" strokeWidth="3" strokeLinecap="round"/>
      <Line x1="40" y1="12" x2="40" y2="4" stroke="#DDBC9B" strokeWidth="3" strokeLinecap="round"/>
      <Line x1="16" y1="31" x2="8" y2="31" stroke="#DDBC9B" strokeWidth="3" strokeLinecap="round"/>
      <Line x1="72" y1="31" x2="64" y2="31" stroke="#DDBC9B" strokeWidth="3" strokeLinecap="round"/>
    </Svg>
  )
}

function BookmarkIcon() {
  return (
    <Svg width={80} height={80} viewBox="0 0 80 80" fill="none">
      <Path d="M20 12 L60 12 L60 70 L40 55 L20 70 Z" stroke="#DDBC9B" strokeWidth="3.5" strokeLinejoin="round"/>
      <Path d="M32 36 L40 44 L52 28" stroke="#DDBC9B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </Svg>
  )
}

const slides: Slide[] = [
  {
    id: '1',
    title: 'Explore Novas Receitas',
    description: 'Explore uma variedade de receitas deliciosas para preparar em casa.',
    icon: <ExploreIcon />,
  },
  {
    id: '2',
    title: 'Crie e Compartilhe',
    description: 'Crie e publique suas próprias receitas e compartilhe com a comunidade.',
    icon: <IdeaIcon />,
  },
  {
    id: '3',
    title: 'Salve suas Favoritas',
    description: 'Guarde suas receitas preferidas e acesse facilmente a qualquer momento.',
    icon: <BookmarkIcon />,
  },
]

export default function OnboardingScreen() {
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  async function handleFinish() {
    await AsyncStorage.setItem('@fastrecipe:onboarding', 'true')
  }

  function handleNext() {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 })
      setCurrentIndex(currentIndex + 1)
    } else {
      handleFinish()
    }
  }

  function renderItem({ item }: ListRenderItemInfo<Slide>) {
    return (
      <View style={styles.slide}>
        <View style={styles.iconWrapper}>
          {item.icon}
        </View>
        <Text style={styles.slideTitle}>{item.title}</Text>
        <Text style={styles.slideDescription}>{item.description}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bem-vindo ao</Text>
        <Text style={styles.logoText}>Fast Recipe !</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width)
          setCurrentIndex(index)
        }}
        style={styles.flatList}
      />

      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.dotActive]}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerLabel}>Botão Onboarding</Text>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? 'Vamos Começar' : 'Próximo'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    alignItems: 'center',
    paddingTop: height * 0.08,
    paddingBottom: 16,
  },
  welcomeText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.regular,
  },
  logoText: {
    color: colors.white,
    fontSize: 28,
    fontFamily: fonts.bold,
  },
  flatList: {
    flex: 1,
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 20,
  },
  iconWrapper: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#DDBC9B',
    borderRadius: 60,
    marginBottom: 8,
  },
  slideTitle: {
    color: colors.white,
    fontSize: 22,
    fontFamily: fonts.bold,
    textAlign: 'center',
  },
  slideDescription: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fonts.regular,
    textAlign: 'center',
    opacity: 0.85,
    lineHeight: 22,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    backgroundColor: colors.white,
    width: 20,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: height * 0.06,
    paddingHorizontal: 40,
    gap: 8,
  },
  footerLabel: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontFamily: fonts.regular,
  },
  button: {
    backgroundColor: '#DDBC9B',
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 60,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: colors.primary,
    fontSize: 16,
    fontFamily: fonts.bold,
    letterSpacing: 1,
  },
})