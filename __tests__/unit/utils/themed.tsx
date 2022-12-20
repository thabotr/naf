import React, {ReactNode} from 'react';
import {ThemeProvider} from '../../../src/shared/providers/theme';

export default (child: ReactNode) => <ThemeProvider>{child}</ThemeProvider>;
