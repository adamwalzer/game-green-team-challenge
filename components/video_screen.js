const SRC = 'https://res.cloudinary.com/changemyworldnow/video/upload/' +
    'v1486507873/bad_stacking_compressed_n3grpw.mp4';

export default function (props, ref, key) {
    return (
        <skoash.Screen
            {...props}
            ref={ref}
            key={key}
            id="video"
            backgroundAudio="BKG5"
        >
            <skoash.Video src={SRC} />
        </skoash.Screen>
    );
}
