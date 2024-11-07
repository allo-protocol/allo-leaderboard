WITH strategies AS (
    SELECT 'Quadratic Funding' as strategy_mapped, 0 as gmv
    UNION ALL 
    SELECT 'MACIQF', 0
    UNION ALL
    SELECT 'EasyRPGFStrategy', 0
    UNION ALL
    SELECT 'Direct Grants', 0
    UNION ALL
    SELECT 'Direct Donations', 0
)
SELECT 
    name 
    , address
    , strategy_name
    , COALESCE(sum(ap.gmv), s.gmv) as gmv
    , COALESCE(
        CASE 
            WHEN strategy_name = 'allov1.QF' THEN 'Quadratic Funding'
            WHEN strategy_name = 'allov2.DonationVotingMerkleDistributionDirectTransferStrategy' THEN 'Quadratic Funding'
            WHEN strategy_name = 'allov1.Direct' THEN 'Direct Grants'
            WHEN strategy_name = 'allov2.DirectGrantsLiteStrategy' THEN 'Direct Grants'
            WHEN strategy_name = 'allov2.DirectAllocationStrategy' THEN 'Direct Donations'
            ELSE strategy_name 
        END,
        s.strategy_mapped
    ) AS mapped_strategy
FROM 
    strategies s
    LEFT JOIN experimental_views.allo_gmv_leaderboard_events ap
        ON CASE 
            WHEN strategy_name = 'allov1.QF' THEN 'Quadratic Funding'
            WHEN strategy_name = 'allov2.DonationVotingMerkleDistributionDirectTransferStrategy' THEN 'Quadratic Funding'
            WHEN strategy_name = 'allov1.Direct' THEN 'Direct Grants'
            WHEN strategy_name = 'allov2.DirectGrantsLiteStrategy' THEN 'Direct Grants'
            WHEN strategy_name = 'allov2.DirectAllocationStrategy' THEN 'Direct Donations'
            ELSE strategy_name 
        END = s.strategy_mapped
        AND (
            address = LOWER($1)
            OR 
            name = $2
        )
GROUP BY 
    name
    , address
    , strategy_name
    , s.strategy_mapped
    , s.gmv
ORDER BY 4 DESC