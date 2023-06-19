import { useState, useEffect } from 'react';
import styles from './mint.module.css'; // Import CSS file for styling
import Image from 'next/image';

const Mint = () => {
    const path = "/images/mintLoading/";
    
    const [isFlipped, setIsFlipped] = useState(false);
    var index : number = 2;
    const [frontImage, setFrontImage] = useState(path + '0.png');
    const [backImage, setBackImage] = useState(path + '1.png');

    const swapImages = () => {
        setFrontImage(path + index.toString() + '.png');
        index += 1;
        // setBackImage(path + index.toString() + '.png');
        if (index > 17) index = 0;
        setIsFlipped(false);
    };

    useEffect(() => {
        const flipInterval = setInterval(() => {
            setIsFlipped(true);
            setTimeout(() => {
                swapImages();
            }, 1000); // Wait for 1 second before flipping back
          }, 2000); // Change card flip interval (in milliseconds)
          return () => clearInterval(flipInterval);
      }, []);

    return (
        <div className={styles.flipContainer} >
            <div className={`${styles.flipCard} ${isFlipped ? styles.flipped : ''}`}>
            <div className={styles.flipCardInner}>
                <div className={styles.flipCardFront}>
                    <Image src={frontImage} alt="Front Image" width={300} height={300} />
                </div>
                <div className={styles.flipCardBack}>
                    <h1>Loading...</h1>
                </div>
            </div>
            </div>
        </div>
    );
};

export default Mint;