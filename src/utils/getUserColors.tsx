import {ColorPerUserField} from '../providers/UserTheme';
import {FileManager} from '../services/FileManager';
import {User} from '../types/user';

async function getColorsForUser(
  u: User,
): Promise<ColorPerUserField | undefined> {
  const avatarURI = await FileManager.getFileURI(u.avatarURI, 'image/jpeg');
  const landscapeURI = await FileManager.getFileURI(
    u.landscapeURI,
    'image/jpeg',
  );
  if (!avatarURI || !landscapeURI) {
    return;
  }

  const avatarColors = await FileManager.getImageColors(avatarURI, true);
  const landscapeColors = await FileManager.getImageColors(landscapeURI, true);
  if (!avatarColors || !landscapeColors) {
    return;
  }

  return {avatar: avatarColors, landscape: landscapeColors};
}

export {getColorsForUser};
