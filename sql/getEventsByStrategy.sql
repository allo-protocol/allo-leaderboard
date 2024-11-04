SELECT 
    name 
    , address
    , strategy_name
    , sum(gmv) as gmv

FROM 
    experimental_views.allo_gmv_leaderboard_events ap
WHERE 
    (
        address = LOWER($1)
    ) 
    OR 
    (
         name = $2
    )
GROUP BY name, address, strategy_name
