import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { HomeTheme } from '@/constants/palette';
import { Spacing } from '@/constants/theme';

interface CheckInPromptProps {
  visible: boolean;
  onCheckIn: () => void;
  onDismiss: () => void;
}

export function CheckInPrompt({ visible, onCheckIn, onDismiss }: CheckInPromptProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onDismiss}>
      <Pressable style={styles.backdrop} onPress={onDismiss}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <ThemedText type="title" style={styles.emoji}>
            👋
          </ThemedText>
          <ThemedText type="subtitle" style={styles.heading}>
            Haven't checked in today
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.body}>
            Want to log how you're feeling? It only takes a minute, and we'll match you with something
            that helps.
          </ThemedText>
          <Button label="Check in now" onPress={onCheckIn} color={HomeTheme.accent} style={styles.button} />
          <Pressable onPress={onDismiss}>
            <ThemedText type="small" themeColor="textSecondary" style={styles.notNow}>
              Not now
            </ThemedText>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.four,
    padding: Spacing.five,
    alignItems: 'center',
    gap: Spacing.two,
    maxWidth: 340,
    width: '100%',
  },
  emoji: {
    fontSize: 40,
    lineHeight: 44,
  },
  heading: {
    textAlign: 'center',
  },
  body: {
    textAlign: 'center',
  },
  button: {
    alignSelf: 'stretch',
    marginTop: Spacing.two,
  },
  notNow: {
    marginTop: Spacing.one,
  },
});
