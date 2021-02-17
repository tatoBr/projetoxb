const uuid = require( 'uuid' );
const { STATUS_CONTENT } = require('../util/constants');

class Content{
    /**
     * Content Class contructor
     * @param { String } title 
     * @param { String } description 
     */
    constructor( title, description ){
        this.id = uuid.v4();
        this.title = title;
        this.description = description;
        this.timeline = [];
        this.status = STATUS_CONTENT.UNDER_ANALYSIS;
    }

    set title( title ){
        title.trim() 
        if( !title ) return;
        this.title = title;
    };

    set description( description ){
        description.trim()
        if( !description ) return;
        this.description = description;
    };

    set status( status ){
        if( Object.values( STATUS_CONTENT ).indexOf( status ) < 0 ) return;
        this.status = status;
    };

    addToTimeline( details ){
        details.trim();
        if( !details ) return;
        this.timeline.push({ date: new Date(), details: details });
    };
}

module.exports = Content;