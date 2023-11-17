class apifeatures{
    constructor(query,querystr)
    {
        this.query=query;
        this.querystr=querystr;
    }
    search()
    {
        const keyword=this.querystr.keyword ? {
            name:{
                $regex:this.querystr.keyword,
                $options:"i",
            },
        } : {};

        console.log(keyword)
        this.query=this.query.find({...keyword});
        return this;
    }

    filter()
    {
        const querycopy={...this.querystr};
        //console.log(querycopy)

        //removing some fields for category
        const rf=["keyword","page","limit"];

        rf.forEach((key)=>{
            delete querycopy[key]
        }
        );

        //filter for price and rating
        console.log(querycopy);
        let querystr=JSON.stringify(querycopy)
       

        querystr=querystr.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>`$${key}`);

        
        this.query=this.query.find(JSON.parse(querystr));
       // console.log(querystr)
        return this;
    }

    pagination(resultperpage)
    {
        const currentpage=Number(this.querystr.page)||1

        const skip=resultperpage*(currentpage-1)

        this.query=this.query.limit(resultperpage).skip(skip);

        return this;
    }
};

module.exports=apifeatures