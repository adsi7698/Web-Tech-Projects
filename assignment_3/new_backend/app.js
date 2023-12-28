const {
    main_table_cleaning,
    get_each_product_url,
} = require("./backend/utility");

const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

const connectDB = require("./backend/db");
connectDB();
const wishlists = require("./models/wishlists");

const app = express();
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

class OAuthToken {
    constructor(client_id, client_secret) {
        this.client_id = client_id;
        this.client_secret = client_secret;
    }

    getBase64Encoding() {
        const credentials = `${this.client_id}:${this.client_secret}`;
        const base64String = btoa(credentials);
        return base64String;
    }

    async getApplicationToken() {
        const url = "https://api.ebay.com/identity/v1/oauth2/token";

        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${this.getBase64Encoding()}`,
        };

        const data = new URLSearchParams();
        data.append("grant_type", "client_credentials");
        data.append("scope", "https://api.ebay.com/oauth/api_scope");

        try {
            const response = await axios.post(url, data, { headers });
            return response.data.access_token;
        } catch (error) {
            console.error("Error obtaining access token:", error);
            throw error;
        }
    }
}

app.get("/testing", (req, res) => {
    const ebay_url = main_table_cleaning(req.query);
    if (ebay_url) {
        axios
            .get(ebay_url)
            .then((response) => {
                
                res.send(JSON.stringify(response.data));
            })
            .catch((error) => {
                console.error("Error:", error);
                res.status(500).send("Ebay unable to handle requests");
            });
    } else {
        res.status(400).send("URL not provided");
    }
});

app.get("/get_each", (req, res) => {
    const item_id = req.query.itemId;
    const decodedUrl = get_each_product_url(item_id);

    const clientId = "AdityaSi-adityasi-PRD-ab45afebc-323e9a90";
    const clientSecret = "PRD-b45afebcfd33-b5ac-4123-a19f-7dd4";

    const oauthToken = new OAuthToken(clientId, clientSecret);

    if (decodedUrl) {
        oauthToken
            .getApplicationToken()
            .then((accessToken) => {
                const headers = {
                    "X-EBAY-API-IAF-TOKEN": accessToken,
                };
                axios
                    .get(decodedUrl, { headers: headers })
                    .then((response) => {
                        res.send(response.data);
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                        res.status(500).send("Ebay unable to handle requests");
                    });
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    } else {
        res.status(400).send("URL not provided");
    }
});

app.get("/get_each_product_images", (req, res) => {
    try {
        const query = req.query.query;
        const url =
            `https://www.googleapis.com/customsearch/v1?q=${query}` +
            "&cx=b7a80534a26ca444c&imgSize=huge&num=8&searchType=image" +
            "&key=AIzaSyCHC-qkGTRNr1pUtqFJYxKm6nMavvAeRo8";

        var config = {
            method: "get",
            url: url,
        };

        if (query) {
            axios(config)
                .then(function (response) {
                    res.send(response.data);
                })
                .catch(function (error) {
                    res.status(400).send("Google Api Limit reached!");
                });
        } else {
            res.status(400).send("Query not provided");
        }
    } catch (err) {
        res.status(400).send("Google Api Not working");
    }
});

app.get("/get_product_similarity", (req, res) => {
    const item_id = req.query.item_id;
    const url =
        "https://svcs.ebay.com/MerchandisingService?OPERATION-NAME=getSimilarItems" +
        "&SERVICE-NAME=MerchandisingService&SERVICE-VERSION=1.1.0" +
        "&CONSUMER-ID=AdityaSi-adityasi-PRD-ab45afebc-323e9a90" +
        `&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&itemId=${item_id}&maxResults=20`;

    var config = {
        method: "get",
        url: url,
    };

    if (item_id) {
        axios(config)
            .then(function (response) {
                res.send(response.data);
            })
            .catch(function (error) {
                console.error("Error:", error);
            });
    } else {
        res.status(400).send("Item not provided");
    }
});

app.get("/get_wishlists", async (req, res) => {
    try {
        const all_wishes = await wishlists.find();
        res.json(all_wishes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post("/add_wishlist", async (req, res) => {
    const incoming_wishlist = new wishlists({
        item_id: req.body.item_id,
        title: req.body.title,
        price: req.body.price,
        shipping_option: req.body.shipping_option,
        image_url: req.body.image_url,
        shipping_details: req.body.shipping_details,
        keyword: req.body.keyword,
        return_accepted: req.body.return_accepted,
        facebook_url: req.body.facebook_url,
    });

    try {
        const new_wishlist = await incoming_wishlist.save();
        res.status(201).json(new_wishlist);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete("/delete_wishlist", get_wishlist, async (req, res) => {
    if (res.found_wishlist) {
        try {
            const id = res.found_wishlist["_id"];
            await wishlists.deleteOne({ _id: id });
            res.json({ message: "Deleted Wishlist" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    } else {
        res.status(404).json({ message: "No document found" });
    }
});

async function get_wishlist(req, res, next) {
    const key = "item_id";
    const value = req.body.item_id;
    var result = null;

    try {
        const query = {};
        query[key] = value;

        result = await wishlists.findOne(query);
    } catch (error) {
        // pass
    }

    res.found_wishlist = result;
    next();
}

app.get("/get_pincodes", async (req, res) => {
    const url =
        "http://api.geonames.org/postalCodeSearchJSON?" +
        `postalcode_startsWith=${req.query.pincode}&` +
        "maxRows=5&username=adityasi&country=US";

    if (url) {
        axios
            .get(url)
            .then((response) => {
                res.send(response.data);
            })
            .catch((error) => {
                console.error("Error:", error);
                res.status(500).send("Ebay unable to handle requests");
            });
    } else {
        res.status(400).send("URL not provided");
    }
});

const port = 8080;
// const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
