var server = process.env.REACT_APP_SERVER;

var myFetch = (url, method = "GET", body = null, refreshOnCatch = true) => {
    var params = {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + window.localStorage.getItem("token"),
        },
    }
    if (method === "PUT" || method === "POST")
        params.body = JSON.stringify(body);
    return fetch(server + url, params).then(res1 => {
            if(res1.status == 401) {
                localStorage.setItem("token", "");
                window.location.reload();                
                return Promise.reject();                
            }  
            else return res1.json()
        })
        .then(res2 => {                            
            if (res2.err) {
                alert("Greska: " + res2.err);
                return Promise.reject();
            }            
            return Promise.resolve(res2);
        })
        .then(res => Promise.resolve(res))
        .catch(() => Promise.reject())
}

export default myFetch;