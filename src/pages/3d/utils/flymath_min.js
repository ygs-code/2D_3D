/*
FlyMath图形数学库
版权所有:Sun zi caho
Email:szcsoft@qq.com
*/

 

  /* eslint-disable   */  
  


var FlyMath_PI=3.1415926;
var FlyMath_DELAY = 0.000001;

var FlyMath = new Object;
var Fly_Base = new Object;
var Fly_Vertex = new Object;
var Fly_Matrix = new Object;
var Fly_Quaternion = new Object;
var Fly_Spline = new Object;
var Fly_Phy = new Object;

var FlyMath_version = "0.62";

//包含模块
FlyMath.Base = Fly_Base;
FlyMath.Matrix = Fly_Matrix;
FlyMath.Vertex = Fly_Vertex;
FlyMath.Quaternion = Fly_Quaternion;
FlyMath.Spline = Fly_Spline;
FlyMath.Phy = Fly_Phy;

//flymath base

//get random from 0-n
Fly_Base.Random = function(n)
{
	var v = Math.floor(Math.random()*n);
	return v;
};

//get power v^n
Fly_Base.Power = function(v,n)
{
	var ret = 1;
	while(n>0)
	{
		ret *= v;
		n--;
	}
	return ret;
};

Fly_Vertex.Dot2 = function(v1,v2)
{
	return v1[0]*v2[0] + v1[1]*v2[1];
};

Fly_Vertex.Cross2 = function(v,v1,v2)
{
	return v1[0]*v2[1] - v1[1]*v2[0];
};


Fly_Vertex.LengthSq2 = function(v)
{
	return v[0]*v[0] + v[1]*v[1];
};

Fly_Vertex.Normalize2 = function(v)
{
	var s = Math.sqrt(Fly_Vertex.LengthSq2(v));

	v[0] /= s;
	v[1] /= s;
};

Fly_Vertex.Lerp2 = function(v,v1,v2,s)
{
	v[0] =  v1[0] +  ( v2[0] - v1[0] ) *s ;
	v[1] =  v1[1] +  ( v2[1] - v1[1] ) *s ;
};

Fly_Vertex.Distance2 = function(v1,v2)
{
	return Math.sqrt((v1[0]-v2[0])*(v1[0]-v2[0])+(v1[1]-v2[1])*(v1[1]-v2[1]));
};

Fly_Vertex.ComputAngle2 = function(v1,v2,v3)
{

    var val = (v2[0]-v1[0]) * (v2[0]-v3[0]) + (v2[1]-v1[1]) * (v2[1]-v3[1]) ;

    var t1 = Math.sqrt( (v2[0]-v1[0]) * (v2[0]-v1[0]) + (v2[1]-v1[1]) * (v2[1]-v1[1]) );
    var t2 = Math.sqrt( (v2[0]-v3[0]) * (v2[0]-v3[0]) + (v2[1]-v3[1]) * (v2[1]-v3[1]) );
    
	return Math.acos(val/(t1*t2));

};

Fly_Vertex.Transfrom2 = function(v,v1,m)
{
	var tv = [v1[0],v1[1],0,1];

	Fly_Vertex.Transfrom4(v,tv,m);
};


//3d

Fly_Vertex.Dot3 = function(v1,v2)
{
	return v1[0]*v2[0] + v1[1]*v2[1] + v1[2]*v2[2];
};

Fly_Vertex.Cross3 = function(v,v1,v2)
{
	v[0] = v1[1]*v2[2] - v1[2]*v2[1];
	v[1] = v1[2]*v2[0] - v1[0]*v2[2];
	v[2] = v1[0]*v2[1] - v1[1]*v2[0];
};

Fly_Vertex.LengthSq3 = function(v)
{
	return v[0]*v[0] + v[1]*v[1] + v[2]*v[2];
};

Fly_Vertex.Normalize3 = function(v)
{
	var s = Math.sqrt(Fly_Vertex.LengthSq3(v));

	v[0] /= s;
	v[1] /= s;
	v[2] /= s;
};

Fly_Vertex.Lerp3 = function(v,v1,v2,s)
{
	v[0] =  v1[0] +  ( v2[0] - v1[0] ) *s ;
	v[1] =  v1[1] +  ( v2[1] - v1[1] ) *s ;
	v[2] =  v1[2] +  ( v2[2] - v1[2] ) *s ;
};

Fly_Vertex.Distance3 = function(v1,v2)
{
	return Math.sqrt((v1[0]-v2[0])*(v1[0]-v2[0])+(v1[1]-v2[1])*(v1[1]-v2[1])+(v1[2]-v2[2])*(v1[2]-v2[2]));
};

Fly_Vertex.ComputAngle3 = function(v1,v2,v3)
{
    var val = (v2[0]-v1[0]) * (v2[0]-v3[0]) + (v2[1]-v1[1]) * (v2[1]-v3[1]) + (v2[2]-v1[2]) * (v2[2]-v3[2]);

    var t1 = Math.sqrt( (v2[0]-v1[0]) * (v2[0]-v1[0]) + (v2[1]-v1[1]) * (v2[1]-v1[1]) + (v2[2]-v1[2]) * (v2[2]-v1[2]));
    var t2 = Math.sqrt( (v2[0]-v3[0]) * (v2[0]-v3[0]) + (v2[1]-v3[1]) * (v2[1]-v3[1]) + (v2[2]-v3[2]) * (v2[2]-v3[2]));

    return Math.acos(val/(t1*t2));
};

Fly_Vertex.Transfrom3 = function(v,v1,m)
{
	var tv = [v1[0],v1[1],v1[2],1];

	Fly_Vertex.Transfrom4(v,tv,m);
};


Fly_Vertex.Transfrom4 = function(v,v1,m)
{
	v[0] =  v1[0]*m[0]+v1[1]*m[4]+v1[2]*m[8]+v1[3]*m[12];
	v[1] =  v1[0]*m[1]+v1[1]*m[5]+v1[2]*m[9]+v1[3]*m[13];
	v[2] =  v1[0]*m[2]+v1[1]*m[6]+v1[2]*m[10]+v1[3]*m[14];
	v[3] =  v1[0]*m[3]+v1[1]*m[7]+v1[2]*m[11]+v1[3]*m[15];
};

Fly_Vertex.TriangleArea = function(a,b,c)
{
	var ret = Math.abs((a[0] * b[1] + b[0] * c[1] + c[0] * a[1] - b[0] * a[1]- c[0] * b[1] - a[0] * c[1]) / 2.0);  
    return ret;
};


//flymath matrix

Fly_Matrix.Identity = function(m,step)
{
	var x,y	
	for(y=0;y<step;y++)
	{
		for(x=0;x<step;x++)
		{
			m[y*step+x]=0;
			if(x==y)
				m[y*step+x]=1;
		}
	}	
};

//matrix m = m1*m2
Fly_Matrix.Multiply = function(m,m1,m2)
{
	var mt=[];
	var x,y;
	var step = Math.sqrt(m1.length);
	var i=0;
	
	for(y=0;y<step;y++)
	{
		for(x=0;x<step;x++)
		{
			mt[y*step+x]=0;
			for(i=0;i<step;i++)
			{
				mt[y*step+x] += m1[y*step+i]*m2[i*step+x];
			}
			
		}
	}
	
	var n=0;
	for(n=0;n<mt.length;n++){
		m[n] = mt[n];	
	}
};



function DetVal(m)
{
	var a = m[0] * (m[4] * m[8] - m[7] * m[5]);
	var b = m[1] * (m[3] * m[8] - m[5] * m[6]);
	var c = m[2] * (m[3] * m[7] - m[4] * m[6]);
	return  a - b + c;
}

//inverse matrix im=m.inverse
Fly_Matrix.Inverse = function(im,m)
{
	var A1 = [m[5],m[6],m[7], m[9],m[10],m[11], m[13],m[14],m[15]];
	var A2 = [m[1],m[2],m[3], m[9],m[10],m[11], m[13],m[14],m[15]];
	var A3 = [m[1],m[2],m[3], m[5],m[6],m[7], m[13],m[14],m[15]];
	var A4 = [m[1],m[2],m[3], m[5],m[6],m[7], m[9],m[10],m[11]];

	var B1 = [m[4],m[6],m[7], m[8],m[10],m[11], m[12],m[14],m[15]];
	var B2 = [m[0],m[2],m[3], m[8],m[10],m[11], m[12],m[14],m[15]];
	var B3 = [m[0],m[2],m[3], m[4],m[6],m[7], m[12],m[14],m[15]];
	var B4 = [m[0],m[2],m[3], m[4],m[6],m[7], m[8],m[10],m[11]];

	var C1 = [m[4],m[5],m[7], m[8],m[9],m[11],m[12],m[13],m[15]];
	var C2 = [m[0],m[1],m[3], m[8],m[9],m[11],m[12],m[13],m[15]];
    var C3 = [m[0],m[1],m[3], m[4],m[5],m[7], m[12],m[13],m[15]];
	var C4 = [m[0],m[1],m[3], m[4],m[5],m[7], m[8],m[9],m[11]];

	var D1 = [m[4],m[5],m[6], m[8],m[9],m[10],m[12],m[13],m[14]];
	var D2 = [m[0],m[1],m[2], m[8],m[9],m[10],m[12],m[13],m[14]];
	var D3 = [m[0],m[1],m[2], m[4],m[5],m[6],m[12],m[13],m[14]];
	var D4 = [m[0],m[1],m[2], m[4],m[5],m[6],m[8],m[9],m[10]];

	var det = m[0]*DetVal(A1) - (m[4]*DetVal(A2)) + (m[8]*DetVal(A3)) - (m[12]*DetVal(A4));

	if(det == 0.0)
	   det = 1.0;

	im[0] = DetVal(A1)/det;	im[1] = -DetVal(A2)/det;	im[2] = DetVal(A3)/det;	im[3] = -DetVal(A4)/det;
	im[4] = -DetVal(B1)/det;	im[5] = DetVal(B2)/det;	im[6] = -DetVal(B3)/det;	im[7] = DetVal(B4)/det;
	im[8] = DetVal(C1)/det;	im[9] = -DetVal(C2)/det;	im[10] = DetVal(C3)/det;	im[11] = -DetVal(C4)/det;
	im[12] = -DetVal(D1)/det;	im[13] = DetVal(D2)/det;	im[14] = -DetVal(D3)/det;	im[15] = DetVal(D4)/det;
};

Fly_Matrix.Transpose = function(m,m1)
{
	m[0] = m1[0];   m[1] = m1[4];   m[2] = m1[8];   m[3] = m1[12];
	m[4] = m1[1];   m[5] = m1[5];   m[6] = m1[9];   m[7] = m1[13];
	m[8] = m1[2];   m[9] = m1[6];   m[10] = m1[10];   m[11] = m1[14];
	m[12] = m1[3];   m[13] = m1[7];   m[14] = m1[11];   m[15] = m1[15];
};

Fly_Matrix.Translation = function(m,x,y,z)
{
	Fly_Matrix.Identity(m,4);

	m[12] = x;
	m[13] = y;
	m[14] = z;
};

Fly_Matrix.Scaling = function(m,x,y,z)
{
	Fly_Matrix.Identity(m,4);
	m[0] = x;
	m[5] = y;
	m[10] = z;
};

Fly_Matrix.RotateX = function(m,angle)
{
	var a = Math.sin(angle);
	var b = Math.cos(angle);
	Fly_Matrix.Identity(m,4);

	m[5] = b;
	m[6] = a;
	m[9] = -a;
	m[10] = b;
}

Fly_Matrix.RotateY = function(m,angle)
{
	var a = Math.sin(angle);
	var b = Math.cos(angle);
	Fly_Matrix.Identity(m,4);

	m[0] = b;
	m[2] = -a;
	m[8] = a;
	m[10] = b;	
};

Fly_Matrix.RotateZ = function(m,angle)
{
	var a = Math.sin(angle);
	var b = Math.cos(angle);
	Fly_Matrix.Identity(m,4);

	m[0] = b;
	m[1] = a;
	m[4] = -a;
	m[5] = b;	
}

Fly_Matrix.LookAtRH = function(m,eye,to,up)
{
	var xaxis = new Array;
	var yaxis = new Array;
	var zaxis = new Array;

	zaxis[0] = eye[0] - to[0];
	zaxis[1] = eye[1] - to[1];
	zaxis[2] = eye[2] - to[2];

    Fly_Vertex.Normalize3(zaxis);
	Fly_Vertex.Cross3(xaxis,up,zaxis);
	Fly_Vertex.Normalize3(xaxis);
	Fly_Vertex.Cross3(yaxis,zaxis,xaxis);

	m[0]=xaxis[0]; m[1]=yaxis[0]; m[2]=zaxis[0]; m[3]=0;
	m[4]=xaxis[1]; m[5]=yaxis[1]; m[6]=zaxis[1]; m[7]=0;
	m[8]=xaxis[2]; m[9]=yaxis[2]; m[10]=zaxis[2];m[11]=0;
	m[12]=-Fly_Vertex.Dot3(xaxis,eye);
	m[13]=-Fly_Vertex.Dot3(yaxis,eye);
	m[14]=-Fly_Vertex.Dot3(zaxis,eye);
	m[15]=1;
};

Fly_Matrix.LookAtLH = function(m,eye,to,up)
{
	var xaxis = new Array;
	var yaxis = new Array;
	var zaxis = new Array;

	zaxis[0] = to[0] - eye[0];
	zaxis[1] = to[1] - eye[1];
	zaxis[2] = to[2] - eye[2];

    Fly_Vertex.Normalize3(zaxis);
	Fly_Vertex.Cross3(xaxis,up,zaxis);
	Fly_Vertex.Normalize3(xaxis);
	Fly_Vertex.Cross3(yaxis,zaxis,xaxis);

	m[0]=xaxis[0]; m[1]=yaxis[0]; m[2]=zaxis[0]; m[3]=0;
	m[4]=xaxis[1]; m[5]=yaxis[1]; m[6]=zaxis[1]; m[7]=0;
	m[8]=xaxis[2]; m[9]=yaxis[2]; m[10]=zaxis[2];m[11]=0;
	m[12]=-Fly_Vertex.Dot3(xaxis,eye);
	m[13]=-Fly_Vertex.Dot3(yaxis,eye);
	m[14]=-Fly_Vertex.Dot3(zaxis,eye);
	m[15]=1;
};

Fly_Matrix.OrthoLH = function(m,w,h,zn,zf)
{
	m[0]=2.0/w; m[1]=0; m[2]=0.0; m[3]=0.0;
	m[4]=0.0;   m[5]=2.0/h; m[6]=0.0; m[7]=0.0;
	m[8]=0.0; m[9]=0.0; m[10]=1.0/(zf-zn); m[11]=0.0;
	m[12]=0.0; m[13]=0.0; m[14]=-zn/(zf-zn); m[15]=1.0;
};

Fly_Matrix.OrthoRH = function(m,w,h,zn,zf)
{
	m[0]=2.0/w; m[1]=0; m[2]=0.0; m[3]=0.0;
	m[4]=0.0;   m[5]=2.0/h; m[6]=0.0; m[7]=0.0;
	m[8]=0.0; m[9]=0.0; m[10]=1.0/(zn-zf); m[11]=0.0;
	m[12]=0.0; m[13]=0.0; m[14]=zn/(zn-zf); m[15]=1.0;
};

Fly_Matrix.PerspectiveLH = function(m,fovy,aspect,zn,zf)
{
	var yscale = Math.tan(FlyMath_PI/2 - fovy/2);
	var xscale = yscale / aspect;

	m[0]=xscale; m[1]=0; m[2]=0; m[3]=0;
	m[4]=0; m[5]=yscale; m[6]=0; m[7]=0;
	m[8]=0; m[9]=0; m[10]=zf/(zf-zn); m[11]=1.0;
	m[12]=0; m[13]=0;
	m[14]=-(zn*zf)/(zf-zn);
	m[15]=0;
};

Fly_Matrix.PerspectiveRH = function(m,fovy,aspect,zn,zf)
{
	var yscale = Math.tan(FlyMath_PI/2 - fovy/2);
	var xscale = yscale / aspect;

	m[0]=xscale; 		m[1]=0; 		m[2]=0; 				m[3]=0;
	m[4]=0; 			m[5]=yscale; 	m[6]=0; 				m[7]=0;
	m[8]=0; 			m[9]=0; 		m[10]=zf/(zn-zf); 		m[11]=-1.0;
	m[12]=0; 			m[13]=0;		m[14]=(zn*zf)/(zn-zf);	m[15]=0;
};

Fly_Matrix.UnProject = function(ray,winX, winY, winZ, model, proj, view)
{
    var inp = [winX,winY,winZ,1.0];
    var matTemp = [];
    var iTemp = [];

    Fly_Matrix.Multiply(matTemp,model, proj);
    Fly_Matrix.Inverse(iTemp,matTemp);

    inp[0] = (inp[0] - view[0]) / view[2];
    inp[1] = (inp[1] - view[1]) / view[3];

    inp[0] = inp[0] * 2 - 1;
    inp[1] = -inp[1] * 2 + 1;
    inp[2] = inp[2] * 2 - 1;

    var out = [];
    Fly_Vertex.Transfrom3(out,inp,iTemp);

    if (out[3] != 0.0) {
    	out[0] /= out[3];
    	out[1] /= out[3];
    	out[2] /= out[3];
	}
	
    ray[0] = out[0];
    ray[1] = out[1];
    ray[2] = out[2];
};

Fly_Matrix.To3d = function(v,pt,matView,matProj,viewport)
{
    var tm=new Array;
    var itm = new Array;

    Fly_Matrix.Multiply(tm,matView,matProj);
    Fly_Matrix.Inverse(itm,tm);

	var t=new Array;
	var t1 = new Array;

    t[0] = pt[0];
	t[1] = pt[1];
	t[2] = pt[2];
	t[3] = 1;

    t[0] = (t[0] - viewport[0]) / (viewport[2]);
    t[1] = (t[1] + viewport[1]) / (viewport[3]);


    t[0] = t[0] * 2.0 - 1;
    t[1] = t[1] *2.0 - 1;
    t[2] = t[2] * 2.0 - 1;

    Fly_Vertex.Transfrom2(t1,t,itm);

    v[0] = t1[0];
    v[1] = t1[1];
    v[2] = t1[2];
    
    if(t1[3]!=0.0)
    {
        v[0] = t1[0] / t1[3];
        v[1] = t1[1] / t1[3];
        v[2] = t1[2] / t1[3];
    }
}


//Fly_Quaternion

Fly_Quaternion.LengthSq = function(q1)
{
	return q1[0]*q1[0] + q1[1]*q1[1] + q1[2]*q1[2] + q1[3]*q1[3];
};

Fly_Quaternion.Normalize = function(q,q1)
{
	var s = Math.sqrt(BQuatLengthSq(q1));

	q[0] = q1[0]/s;
	q[1] = q1[1]/s;
	q[2] = q1[2]/s;
	q[3] = q1[3]/s;
};

var Fly_Quaternion_Slerp = function(q,q1,q2,s,isline)
{
	if(isline)
	{
		q[0] = (1.0-s)*q1[0] + s*q2[0];
		q[1] = (1.0-s)*q1[1] + s*q2[1];
		q[2] = (1.0-s)*q1[2] + s*q2[2];
		q[3] = (1.0-s)*q1[3] + s*q2[3];
		return;
	}

	var tol=new Array;
	var omega, cosom, sinom, scale0, scale1;

	cosom = (q1[0] * q2[0]) + (q1[1] * q2[1]) + (q1[2] + q2[2]) * (q1[3] * q2[3]);

	if(cosom<0.0)
	{
		cosom = -cosom;
		tol[0] = -q2[0];
		tol[1] = -q2[1];
		tol[2] = -q2[2];
		tol[3] = -q2[3];
	}
	else
	{
		tol[0] = -q2[0];
		tol[1] = -q2[1];
		tol[2] = -q2[2];
		tol[3] = -q2[3];
	}

	if((1.0-cosom)>0.01)
	{
		omega = Math.acos(cosom);
		sinom = Math.sin(omega);
		scale0 = Math.sin((1.0 - s) * omega) / sinom;
		scale1 = Math.sin(s * omega) / sinom;
	}
	else
	{
		scale0 = 1.0 - s;
		scale1 = s;
	}
	q[0] = scale0 * q1[0] + scale1 * tol[0];
	q[1] = scale0 * q1[1] + scale1 * tol[1];
	q[2] = scale0 * q1[2] + scale1 * tol[2];
	q[3] = scale0 * q1[3] + scale1 * tol[3];

};

Fly_Quaternion.RotationAxis =function(q,v,angle)
{
	q[0] = v[0];
	q[1] = v[1];
	q[2] = v[2];
	q[3] = v[3];
	
	FlyMath.Vertex.Normalize3(q);

	q[0] *=Math.sin(angle*0.5);
	q[1] *=Math.sin(angle*0.5);
	q[2] *=Math.sin(angle*0.5);
	q[3] = Math.cos(angle*0.5);
};

Fly_Quaternion.MatToQuat = function(q,m)
{
	var s;
    var tq=new Array;
    var i, j;

    // Use tq to store the largest trace
    tq[0] = 1.0 + m[0]+m[5]+m[10];
    tq[1] = 1.0 + m[0]-m[5]-m[10];
    tq[2] = 1.0 - m[0]+m[5]-m[10];
    tq[3] = 1.0 - m[0]-m[5]+m[10];

    // Find the maximum (could also use stacked if's later)
    j = 0;
    for(i=1;i<4;i++)
		j = (tq[i]>tq[j])? i : j;

    // check the diagonal
    if (j==0)
    {
        /* perfrom instant calculation */
		q[3] = tq[0];
        q[0] = m[6]-m[9];
        q[1] = m[8]-m[2];
        q[2] = m[1]-m[4];
    }
    else if (j==1)
    {
        q[3] = m[6]-m[9];
        q[0] = tq[1];
        q[1] = m[1]+m[4];
        q[2] = m[8]+m[2];
    }
    else if (j==2)
    {
        q[3] = m[8]-m[2];
        q[0] = m[1]+m[4];
        q[1] = tq[2];
        q[2] = m[6]+m[9];
    }
    else /* if (j==3) */
    {
        q[3] = m[1]-m[4];
        q[0] = m[8]+m[2];
        q[1] = m[6]+m[9];
        q[2] = tq[3];
    }

    s = Math.sqrt(0.25 / tq[j]);

	q[0] *=s;
	q[1] *=s;
	q[2] *=s;
	q[3] *=s;
};

Fly_Quaternion.QuatToMat = function(m,q1)
{
	var wx, wy, wz, xx, yy, yz, xy, xz, zz, x2, y2, z2;

	 //计算相关的系数
	 x2 = q1[0] + q1[0];
	 y2 = q1[1] + q1[1];
	 z2 = q1[2] + q1[2];

	 xx = q1[0] * x2;
	 xy = q1[0] * y2;
	 xz = q1[0] * z2;
	 yy = q1[1] * y2;
	 yz = q1[1] * z2;
	 zz = q1[2] * z2;
	 wx = q1[3] * x2;
	 wy = q1[3] * y2;
	 wz = q1[3] * z2;

	 //将其填入矩阵位置
	 m[0] = 1.000000 - (yy +zz);
	 m[4] = xy - wz;
	 m[8] = xz + wy;
	 m[12] = 0.0;
	 m[1] = xy + wz;
	 m[5] = 1.000000-(xx+zz);
	 m[9] = yz - wx;
	 m[13] = 0.0;
	 m[2] = xz - wy;
	 m[6] = yz + wx;
	 m[10] = 1.000000 - (xx + yy);
	 m[14] = 0.0;
	 m[3] = 0.0;
	 m[7] = 0.0;
	 m[11] = 0.0;
	 m[15] = 1.000000;
};

//spline
Fly_Spline.BaryCentric2 = function(p,p1,p2,p3,f,g)
{
	p[0] = p1[0] + (p2[0]- p1[0])*f + (p3[0] - p1[0])*g;
	p[1] = p1[1] + (p2[1]- p1[1])*f + (p3[1] - p1[1])*g;
};

Fly_Spline.BaryCentric3 = function(p,p1,p2,p3,f,g)
{
	p[0] = p1[0] + (p2[0]- p1[0])*f + (p3[0] - p1[0])*g;
	p[1] = p1[1] + (p2[1]- p1[1])*f + (p3[1] - p1[1])*g;
	p[2] = p1[2] + (p2[2]- p1[2])*f + (p3[2] - p1[2])*g;
};

Fly_Spline.CatmullRom2 = function(p,p1,p2,p3,p4,s)
{
	var t1 = [ (p3[0]-p1[0])/2 , (p3[1]-p1[1])/2 ];
	var t2 = [ (p4[0]-p2[0])/2 , (p4[1]-p2[1])/2 ];

	var s2 = Fly_Base.Power(s,2);
	var s3 = Fly_Base.Power(s,3);

	p = [ p2[0]*(2*s3-3*s2+1) + p3[0]*(-2*s3+3*s2) + t1[0] *(s3-2*s2+s) + t2[0]*(s3-s2),
		p2[1]*(2*s3-3*s2+1) + p3[1]*(-2*s3+3*s2) + t1[1] *(s3-2*s2+s) + t2[1]*(s3-s2)];
};

Fly_Spline.CatmullRom3 = function(p,p1,p2,p3,p4,s)
{
	var t1 = [ (p3[0]-p1[0])/2 , (p3[1]-p1[1])/2 , (p3[2]-p1[2])/2];
	var t2 = [ (p4[0]-p2[0])/2 , (p4[1]-p2[1])/2 , (p4[2]-p2[2])/2];

	var s2 = FlyMath.Base.Power(s,2);
	var s3 = FlyMath.Base.Power(s,3);

	p = [ p2[0]*(2*s3-3*s2+1) + p3[0]*(-2*s3+3*s2) + t1[0] *(s3-2*s2+s) + t2[0]*(s3-s2),
		p2[1]*(2*s3-3*s2+1) + p3[1]*(-2*s3+3*s2) + t1[1] *(s3-2*s2+s) + t2[1]*(s3-s2),
		p2[2]*(2*s3-3*s2+1) + p3[2]*(-2*s3+3*s2) + t1[2] *(s3-2*s2+s) + t2[2]*(s3-s2)];
};



Fly_Spline.Hermite2 = function(p,p1,tan1,p2,tan2,s)
{
	var A = [ p1[0]*2 - p2[0]*2 + tan2[0] + tan1[0] ,
			p1[1]*2 - p2[1]*2 + tan2[1] + tan1[1]];

	var B = [ p2[0]*3 - p1[0]*3 - tan1[0]*2 - tan2[0],
			p2[1]*3 - p1[1]*3 - tan1[1]*2 - tan2[1]];
	
	var a1 = FlyMath.Base.Power(s,3);
	var b1 = FlyMath.Base.Power(s,2);

	p = [ A[0]*a1 + B[0]*b1 + tan1[0]*s + p1[0],
		A[1]*a1 + B[1]*b1 + tan1[1]*s + p1[1]];
}

Fly_Spline.Hermite3 = function(p,p1,tan1,p2,tan2,s)
{
	var A = [ p1[0]*2 - p2[0]*2 + tan2[0] + tan1[0] ,
			p1[1]*2 - p2[1]*2 + tan2[1] + tan1[1],
			p1[2]*2 - p2[2]*2 + tan2[2] + tan1[2]];

	var B = [ p2[0]*3 - p1[0]*3 - tan1[0]*2 - tan2[0],
			p2[1]*3 - p1[1]*3 - tan1[1]*2 - tan2[1],
			p2[2]*3 - p1[2]*3 - tan1[2]*2 - tan2[2]];
	
	var a1 = FlyMath.Base.Power(s,3);
	var b1 = FlyMath.Base.Power(s,2);

	p = [ A[0]*a1 + B[0]*b1 + tan1[0]*s + p1[0],
		A[1]*a1 + B[1]*b1 + tan1[1]*s + p1[1],
		A[2]*a1 + B[2]*b1 + tan1[2]*s + p1[2]];
};

//phy

Fly_Phy.Ray2Triangle = function(pStart,pEnd,p1,p2,p3,dist)
{
	var e1 = [p2[0]-p1[0],p2[1]-p1[1],p2[2]-p1[2]];
	var e2 = [p3[0]-p1[0],p3[1]-p1[1],p3[2]-p1[2]];

	var pvec = new Array;
	
	var pDir = [pEnd[0]-pStart[0],pEnd[1]-pStart[1],pEnd[2]-pStart[2]];

	FlyMath.Vertex.Cross3(pvec,pDir,e2);

	var det = Fly_Vertex.Dot3(e1,pvec);

	var tvec = new Array;
	var qvec = new Array;

	if(det>FlyMath_DELAY)
	{
		tvec  = [pStart[0]-p1[0],pStart[1]-p1[1],pStart[2]-p1[2]];
	}
	else
	{
		tvec = [p1[0]-pStart[0],p1[1]-pStart[1],p1[2]-pStart[2]];
		det = -det;
	}

	if(det<FlyMath_DELAY)
		return 1;

	var tu,tv;

	tu = FlyMath.Vertex.Dot3(tvec,pvec);

	if(tu<FlyMath_DELAY || tu>det)
		return false;

	FlyMath.Vertex.Cross3(qvec,tvec,e1);

	tv = FlyMath.Vertex.Dot3(pDir,qvec);

	if(tv<FlyMath_DELAY || (tu+tv)>det)
		return false;

    dist = FlyMath.Vertex.Dot3(e2,qvec);
    dist *= 1.000000/det;

	return true;
};

Fly_Phy.Ray2Quad = function(pStart,pEnd,p1,p2,p3,p4,dist)
{

    if(Fly_Phy.Ray2Triangle(pStart,pEnd,p1,p2,p3,dist))
		return true;

    if(Fly_Phy.Ray2Triangle(pStart,pEnd,p2,p3,p4,dist))
		return true;

	return false;
};

Fly_Phy.SortQuad = function(q)
{
	var t=0;
	var n=0;
	var step = q.length/2;
	
	for(n=0;n<q.length/2;n++)
	{	
		if(q[n]>q[n+step])
		{
			t=q[n];q[n]=q[n+step];q[n+step]=t;
		}
	}	
};

Fly_Phy.Quad2Quad = function(q1,q2)
{
	Fly_Phy.SortQuad(q1);
	Fly_Phy.SortQuad(q2);

	var w = q1[2] - q1[0] + q2[2] - q2[0];
	var h = q1[3] - q1[1] + q2[3] - q2[1];
	
	var w1,h1;
	
	if(q2[2]>q1[2])
		w1 = q2[2] - q1[0];
	else
		w1 = q1[2] - q2[0];
	
	if(q2[3]>q1[3])
		h1 = q2[3] - q1[1];
	else
		h1 = q1[3] - q2[1];
	
	if(w1<w && h1<h)
		return true;
	return false;
};

Fly_Phy.PtInQuad = function(p,a,b,c,d)
{
	var r1 = Fly_Vertex.TriangleArea(a, b, p) + Fly_Vertex.TriangleArea(b, c, p) + Fly_Vertex.TriangleArea(c, d, p) + Fly_Vertex.TriangleArea(d, a, p);  
    var r2 = Fly_Vertex.TriangleArea(a, b, c) + Fly_Vertex.TriangleArea(c, d, a);  
    
	if(r1==r2)
		return true;
	return false;	
};



export default FlyMath;

  /* eslint-disable   */