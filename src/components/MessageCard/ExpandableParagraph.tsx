import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {IconButton, Paragraph} from 'react-native-paper';
import {useTheme} from '../../context/theme';
import {OnlyShow} from '../Helpers/OnlyShow';
import {Show} from '../Helpers/Show';

const ExpandableParagraph = ({text}: {text?: string}) => {
  const [expanded, setExpanded] = useState(false);
  const {theme} = useTheme();
  const toggleExpanded = () =>
    expanded ? setExpanded(false) : setExpanded(true);

  const styles = StyleSheet.create({
    collapseButton: {width: '100%', height: 10},
    paragraph: {
      color: theme.color.textPrimary,
      textShadowColor: theme.color.textSecondary,
    },
  });

  return (
    <OnlyShow If={!!text}>
      <Show
        component={
          <>
            <Paragraph
              style={styles.paragraph}
              onPress={toggleExpanded}
              numberOfLines={!expanded ? 2 : 0}>
              {text}
            </Paragraph>
            <IconButton
              onPress={toggleExpanded}
              style={styles.collapseButton}
              size={15}
              icon={expanded ? 'chevron-up' : 'chevron-down'}
            />
          </>
        }
        If={(text?.length ?? 0) > 150}
        ElseShow={
          <Paragraph numberOfLines={1} style={styles.paragraph}>
            {text}
          </Paragraph>
        }
      />
    </OnlyShow>
  );
};

export {ExpandableParagraph};
