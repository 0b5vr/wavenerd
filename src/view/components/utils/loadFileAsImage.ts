export function loadFileAsImage( file: File ): Promise<HTMLImageElement> {
  return new Promise( ( resolve, reject ) => {
    const url = URL.createObjectURL( file );

    const image = new Image();

    image.onload = () => {
      resolve( image );
    };

    image.onerror = () => {
      reject( 'Could not load an image.' );
    };

    image.src = url;
  } );
}
