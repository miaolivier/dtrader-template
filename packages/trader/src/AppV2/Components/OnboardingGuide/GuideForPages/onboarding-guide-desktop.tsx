import React from 'react';

import { useLocalStorageData } from '@deriv/api';
import { Modal } from '@deriv-com/quill-ui';
import { Localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';

import GuideContainer from './guide-container';
import DESKTOP_STEPS from './steps-config-desktop';

import './onboarding-guide-desktop.scss';

type TOnboardingGuideDesktopProps = {
    callback?: () => void;
    type?: 'trade_page' | 'positions_page';
};

const OnboardingGuideDesktop = ({ type = 'trade_page', callback }: TOnboardingGuideDesktopProps) => {
    const { isDesktop } = useDevice();
    const [is_modal_open, setIsModalOpen] = React.useState(false);
    const [should_run_guide, setShouldRunGuide] = React.useState(false);
    const guide_timeout_ref = React.useRef<ReturnType<typeof setTimeout>>();

    const [guide_dtrader_v2, setGuideDtraderV2] = useLocalStorageData<Record<string, boolean>>('guide_dtrader_v2', {
        trade_types_selection: false,
        trade_page: false,
        positions_page: false,
    });

    const onGuideStart = React.useCallback(() => {
        setShouldRunGuide(true);
        setIsModalOpen(false);
    }, []);

    const onFinishGuide = React.useCallback(() => {
        setShouldRunGuide(false);
        setGuideDtraderV2({ ...guide_dtrader_v2, [type]: true });
        callback?.();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setGuideDtraderV2, type]);

    const onSkipGuide = React.useCallback(() => {
        setIsModalOpen(false);
        setGuideDtraderV2({ ...guide_dtrader_v2, [type]: true });
        callback?.();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setGuideDtraderV2, type]);

    React.useEffect(() => {
        // Only show onboarding for desktop users
        if (!isDesktop) return;

        // For new users: show modal to start full onboarding
        if (!guide_dtrader_v2?.[type]) {
            guide_timeout_ref.current = setTimeout(() => setIsModalOpen(true), 800);
        }

        return () => clearTimeout(guide_timeout_ref.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [guide_dtrader_v2?.[type], isDesktop]);

    // Only show onboarding for desktop users
    if (!isDesktop) return null;

    return (
        <React.Fragment>
            <Modal
                isOpened={is_modal_open}
                toggleModal={onSkipGuide}
                primaryButtonLabel={<Localize i18n_default_text="Let's begin" />}
                primaryButtonCallback={onGuideStart}
                shouldCloseOnPrimaryButtonClick
                showCrossIcon
                className='onboarding-guide-desktop'
            >
                <Modal.Body className='onboarding-guide-desktop__body'>
                    <h2 className='onboarding-guide-desktop__title'>
                        <Localize i18n_default_text='Welcome to the new Deriv Trader' />
                    </h2>
                    <p className='onboarding-guide-desktop__description'>
                        <Localize i18n_default_text="Enjoy a smoother, more intuitive trading experience. Here's a quick tour to get you started." />
                    </p>
                </Modal.Body>
            </Modal>
            <GuideContainer should_run={should_run_guide} onFinishGuide={onFinishGuide} custom_steps={DESKTOP_STEPS} />
        </React.Fragment>
    );
};

export default React.memo(OnboardingGuideDesktop);
