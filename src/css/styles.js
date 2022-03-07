
import {
  StyleSheet,Dimensions
} from 'react-native';
import { COLORS } from "../constants";
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
const styles = StyleSheet.create({
    iconTab:{width:24,height:24,marginTop:8},
    backgroundMainHome:{backgroundColor:COLORS.backgroundHome,height:screenHeight,width:screenWidth},
    backgroundMain:{backgroundColor:COLORS.white,height:screenHeight,width:screenWidth},
    ContainMain:{justifyContent:'flex-end',width:'100%',padding:10,height:'100%',backgroundColor:'rgba(227,0,82,0.04)',paddingBottom:50},
    btnHight:{height:45,borderRadius:5,justifyContent:'center'},
    textBtnLg:{color:'#000',fontSize:15,textAlign:'center', fontWeight:'bold'},
    textBtnLgWhite:{color:'#fff',fontSize:15,textAlign:'center', fontWeight:'bold'},
    btnNormal:{height:45,marginTop:25,borderRadius:5,justifyContent:'center',borderColor:'#fff',borderWidth:1},
    headerRegister:{height:70,justifyContent:'center',paddingLeft:20},
    containBack:{width:35,height:35,borderRadius:20,justifyContent:'center',alignItems:'center'},
    iconBack:{width:22,height:22},
    containRegister01:{justifyContent:'center',alignItems:'center'},
    txtHeader:{fontSize:22,fontWeight:'bold'},
    txtNormal:{fontSize:14,color:COLORS.txtNormal},
    line:{marginTop:10},
    containRegister02:{padding:20,marginTop:10},
    input:{height:42,backgroundColor:COLORS.backgroundHome,width:'100%',borderRadius:5,paddingLeft:15,paddingRight:15},
    inputForcus:{height:42,backgroundColor:COLORS.white,borderColor:COLORS.btnStart,borderWidth:1,width:'100%',borderRadius:5,paddingLeft:15,paddingRight:15},
    txtInput:{fontSize:14,marginBottom:7},
    containInput:{paddingTop:20},
    iconView:{height:20, width:20,resizeMode:'stretch'},
    headerContain:{width:'100%',height:100,justifyContent:'space-between',flexDirection:'row',alignItems:'center'},
    containSlider:{width:280,marginRight:20,borderRadius:10},
    imageSlide:{width:280,height:120,borderRadius:10},
    iconSlide:{width:22,height:12,resizeMode:'contain'},
    slideContain:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:10,marginBottom:10}
    
});


export default styles;