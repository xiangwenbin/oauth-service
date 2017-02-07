import _ from 'lodash';

class Util {
    /**
     * 获取默认请求头
     */
    static getDefaultHeads(ctx) {
        if (ctx) {
            return {
                'Cookie': ctx.get("Cookie"),
                'Authorization': ctx.get("Authorization") || (ctx.session.loginRes ? tx.session.token_type + " " + tx.session.access_token : ''),
            }
        } else {
            return {

            };
        }
    }

    static getJsonHeads() {
        return {
            'Content-Type': 'application/json;chaset=UTF-8'
        }
    }

    static getdefaultOptions(ctx) {
        return {
            method: 'GET',
            headers: {
                'Content-Type': 'text/plain;chaset=UTF-8'
            },
            json: true
        };
    }

    static getJsonOption() {
        return {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;chaset=UTF-8'
            },
            json: true
        };
    }

    static getFormOption() {
        return {
            method: 'POST',
            form: {

            },
            json: true
        };
    }

}
export default Util;