WITH roles AS (
    SELECT 'donor' as role, 0 as gmv
    UNION ALL 
    SELECT 'round_operator', 0
    UNION ALL
    SELECT 'contract_dev', 0
    UNION ALL
    SELECT 'grantee', 0
)

SELECT 
    name 
    , address
    , COALESCE(ap.role, r.role) as role
    , COALESCE(sum(ap.gmv), r.gmv) as gmv 
FROM 
    roles r
    LEFT JOIN experimental_views.allo_gmv_leaderboard_events ap
        ON r.role = ap.role
        AND (
            address = LOWER($1)
            OR 
            name = $2
        )
GROUP BY 
    name
    , address
    , COALESCE(ap.role, r.role)
    , r.gmv
ORDER BY 4 desc