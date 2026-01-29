import clsx from 'clsx';

import { Skeleton, TooltipPortal } from '@deriv/components';
import { observer } from '@deriv/stores';
import { Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv-com/translations';

import { useTraderStore } from 'Stores/useTraderStores';

const PayoutPerPointInfo = observer(() => {
    const { contract_type, currency, is_market_closed, proposal_info } = useTraderStore();
    const contract_key = contract_type.toUpperCase();
    const { value: payout_per_point } = proposal_info[contract_key]?.obj_contract_basis || {};
    const has_error = proposal_info[contract_key]?.has_error;

    if (has_error) return null;

    const tooltipMessage = (
        <Localize i18n_default_text="The money you earn or lose for every one-point change in an asset's price." />
    );

    return (
        <div className='payout-per-point-info__container'>
            <TooltipPortal message={tooltipMessage} position='left'>
                <Text
                    size='sm'
                    className={clsx('payout-per-point-info__label', is_market_closed && 'trade-params__text--disabled')}
                >
                    <Localize i18n_default_text='Payout per point' />
                </Text>
            </TooltipPortal>
            {payout_per_point ? (
                <Text size='sm' className={clsx(is_market_closed && 'trade-params__text--disabled')}>
                    {payout_per_point} {currency}
                </Text>
            ) : (
                <Skeleton width={100} height={14} />
            )}
        </div>
    );
});

export default PayoutPerPointInfo;
