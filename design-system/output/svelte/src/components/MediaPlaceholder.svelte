<script context='module' lang='ts'>
      type MediaPlaceholderProps = {
width?: number;
height?: number;
aspectRatio?: string;
}

    </script>
    

    
<script lang='ts'>










     export let width: MediaPlaceholderProps['width']= undefined;
export let height: MediaPlaceholderProps['height']= undefined;
export let aspectRatio: MediaPlaceholderProps['aspectRatio']= undefined;
     function stringifyStyles(stylesObj) {
  let styles = '';
  for (let key in stylesObj) {
    const dashedKey = key.replace(/[A-Z]/g, function(match) {
      return '-' + match.toLowerCase();
    });
    styles += dashedKey + ":" + stylesObj[key] + ";";
  }
  return styles;
}

















   </script>

   <div style={stringifyStyles({
 width: width ? `${width}px` : '100%',
 height: height ? `${height}px` : undefined,
 aspectRatio: aspectRatio
})} class="rdp-media-placeholder"  aria-hidden="true" ><svg  viewBox="0 0 100 60"  preserveAspectRatio="none" ><line  x1="0"  y1="0"  x2="100"  y2="60"  stroke="var(--color-light-grey)"  strokeWidth="1" ></line><line  x1="100"  y1="0"  x2="0"  y2="60"  stroke="var(--color-light-grey)"  strokeWidth="1" ></line></svg></div>