export class AudioDestinationRouter {
  public readonly audio: AudioContext;

  private __sources: { [ key: string ]: {
    source: AudioNode;
    splitter: ChannelSplitterNode;
  } };
  private __routing: string;
  private __merger: ChannelMergerNode;

  public get channelCount(): number {
    return this.audio.destination.channelCount;
  }

  public constructor( audio: AudioContext ) {
    this.audio = audio;

    const destination = audio.destination;
    destination.channelCount = destination.maxChannelCount;

    this.__sources = {};
    this.__routing = '';

    this.__merger = audio.createChannelMerger( destination.channelCount );
    this.__merger.connect( destination );
  }

  public addSource( key: string, source: AudioNode ): void {
    const splitter = this.audio.createChannelSplitter( source.channelCount );
    source.connect( splitter );

    this.__sources[ key ] = {
      source,
      splitter,
    };

    this.__updateConnections();
  }

  public setRouting( routing: string ): void {
    this.__routing = routing;

    this.__updateConnections();
  }

  private __updateConnections(): void {
    for ( const sourceObj of Object.values( this.__sources ) ) {
      sourceObj.splitter.disconnect();
    }

    const routes = this.__routing.split( ',' );

    for ( let i = 0; i < this.channelCount; i ++ ) {
      const route = routes[ i ];
      if ( route == null ) { continue; }

      const [ sourceKey, channelStr ] = route.split( ':' );
      const channel = parseInt( channelStr, 10 );

      const sourceObj = this.__sources[ sourceKey ];
      if ( sourceObj == null ) { continue; }

      const { splitter } = sourceObj;
      splitter.connect( this.__merger, channel, i );
    }
  }
}
