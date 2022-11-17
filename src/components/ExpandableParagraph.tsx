import React from 'react';
import { IconButton, Paragraph } from 'react-native-paper';
import { useTheme } from '../context/theme';
import { Show } from './Helpers/Show';

const ExpandableParagraph = ({text}: {text: string}) => {
  const [expanded, setExpanded] = React.useState(false);
  const {theme} = useTheme();
  const toggleExpanded = () =>
    expanded ? setExpanded(false) : setExpanded(true);

  return (
    <Show
      component={
        <>
          <Paragraph
            style={{
              color: theme.color.textPrimary,
              textShadowColor: theme.color.textSecondary,
            }}
            onPress={toggleExpanded}
            numberOfLines={!expanded ? 2 : 0}>
            {text}
          </Paragraph>
          <IconButton
            onPress={toggleExpanded}
            style={{width: '100%', height: 10}}
            size={15}
            icon={expanded ? 'chevron-up' : 'chevron-down'}
          />
        </>
      }
      If={text.length > 150}
      ElseShow={
        <Paragraph
          style={{
            color: theme.color.textPrimary,
            textShadowColor: theme.color.textSecondary,
          }}>
          {text}
        </Paragraph>
      }
    />
  );
};

export {ExpandableParagraph};