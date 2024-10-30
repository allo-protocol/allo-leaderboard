SELECT 
    name 
    , address
    , gmv
    , role
    , tx_timestamp
    , tx_hash
    , blockchain
FROM 
    experimental_views.allo_gmv_leaderboard_events ap
WHERE 
    (
        address = $1
    ) 
    OR 
    (
         name = $2
    )
ORDER BY 
    tx_timestamp DESC;
