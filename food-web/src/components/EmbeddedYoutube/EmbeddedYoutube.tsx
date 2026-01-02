// @ts-ignore
import styles from "./EmbeddedYoutube.module.css";

const renderYoutube = (link: string) => {
    const youtubePostFix = link.split("=").at(-1)
    const embeddedLink = `https://www.youtube.com/embed/${youtubePostFix}`
    return (
        <div className={styles.videoWrapper}>
            <iframe
                className={styles.iframe}
                src={embeddedLink}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
            />
        </div>
    )
}

export default renderYoutube;
