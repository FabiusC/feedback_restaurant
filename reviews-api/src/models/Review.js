class Review {
    constructor(idreview, idemployee, date, ratespeedservice, ratesatisfactionfood, rateemployee, comment, ispublic) {
        this.idreview = idreview;
        this.idemployee = idemployee;
        this.date = date;
        this.ratespeedservice = ratespeedservice;
        this.ratesatisfactionfood = ratesatisfactionfood;
        this.rateemployee = rateemployee;
        this.comment = comment;
        this.ispublic = ispublic;
    }

    static insertReviewQuery() {
        return `
            INSERT INTO review (idemployee, ratespeedservice, ratesatisfactionfood, rateemployee, comment, ispublic)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
    }

    static getPublicReviewsQuery() {
        return `
            SELECT * FROM review
            WHERE ispublic = true
            ORDER BY date DESC;
        `;
    }

    static getAllReviewsQuery() {
        return `
            SELECT * FROM review
            ORDER BY date DESC;
        `;
    }
}

export default Review;