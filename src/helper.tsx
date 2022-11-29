export const verboseSize = (bytes: number):string=> {
  if( bytes < 1024) return `${bytes}B`;
  const kBs = Math.floor(bytes/1024);
  if( kBs < 1024) return `${(bytes/1024).toFixed(1)}KB`;
  const mBs = Math.floor(kBs/1024);
  if( mBs < 1024) return `${(bytes/1024**2).toFixed(1)}MB`;
  return `${(bytes/1024**3).toFixed(1)}GB`;
}

export const verboseTime = (timestamp?: number):string|undefined => {
  if(!timestamp){
      return undefined;
  }
  const time = new Date(timestamp);
  const now = new Date();
  const timeDiffSec = Math.floor(Math.abs(now.getTime() - time.getTime())/1000);
  const min = 60;
  const hour = min*60;
  const day = hour*24;
  const week = day*7;
  const TimeDifference = {
      WEEKS: Math.floor(timeDiffSec/week),
      DAYS: Math.floor(timeDiffSec/day),
      HOURS: Math.floor(timeDiffSec/hour),
      MINUTES: Math.floor(timeDiffSec/min)
  }
  if( TimeDifference.WEEKS > 1) return `${time.toLocaleTimeString()}, ${time.toLocaleDateString()}`;
  else if( TimeDifference.WEEKS === 1) return 'a week ago';
  else if( TimeDifference.DAYS > 1) return `${TimeDifference.DAYS} days ago`;
  else if( TimeDifference.DAYS === 1) return 'a day ago';
  else if( TimeDifference.HOURS > 1) return `${TimeDifference.HOURS} hrs ago`;
  else if( TimeDifference.HOURS === 1) return 'an hour ago';
  else if( TimeDifference.MINUTES > 1) return `${TimeDifference.MINUTES} mins ago`;
  else if( TimeDifference.MINUTES === 1) return `a minute ago`;
  return 'just now';
}

export function zeroPad(num: number):string { return num < 10 ? `0${num}` : `${num}`};

export function verboseDuration(seconds: number): string {
    seconds = Math.floor(seconds);
    const minSecs = `${zeroPad(Math.floor(seconds/60)%60)}:${zeroPad(seconds%60)}`;
    return seconds/3600 < 1 ? minSecs : `${zeroPad(Math.floor(seconds/3600))}:${minSecs}`;
}