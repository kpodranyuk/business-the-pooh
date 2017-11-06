/**
 * Класс пользователя для модели
 * @param {string} login - логин пользователя 
 * @param {string} name - имя пользователя
 * @param {string} productType - тип продукта('F','B','P','H')
 */
function User(login, name, productType) {
    this.login = login;
    this.password = "";
    this.name = name;
    this.isAdmin = false;
    this.productType = productType;
    this.productAmount = 0;
    this.honeyAmount = 0;
    this.promotion = null;

    /**
     * Купить мед
     * @param {number} countPots - количество горшочков меда
     */
    this.buyHoney = function(countPots) {
        var rate = 0;
        if (this.productType == 'F' || this.productType == 'B') {
            rate = 10;
        }
        else if (this.productType == 'P') {
            rate = 5;
        }

        this.productAmount = Number(this.productAmount) - Number(((countPots * rate).toFixed(5)));
        this.honeyAmount = Number(this.honeyAmount) + Number(((countPots * 0.25).toFixed(5)));

        this.promotion.operationsCount = this.promotion.operationsCount + 1;
        this.promotion.operationsToNext = this.promotion.operationsToNext - 1;
        if (this.promotion.operationsToNext <= 0) {
            if (this.promotion.operationsCount == 5) {
                this.promotion.operationsToNext = 10;
            } else if (this.promotion.operationsCount >= 15) {
                this.promotion.operationsToNext = 0;
            }
        }
    };

    this.calculateNewPromotion = function() {
        
        if (this.promotion.operationsCount == 5 && this.promotion.operationsToNext == 10) {
            this.promotion.percent = 10;
        } else if (this.promotion.operationsCount >= 15) {
            this.promotion.percent = 5;
        }
    }
}

module.exports = User;

