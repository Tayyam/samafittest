import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from './config';
import type { RankingData } from '../../types';

export const getRankings = async (): Promise<RankingData[]> => {
  try {
    // جلب جميع المستخدمين
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    const users = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // جلب بيانات InBody
    const inBodyRef = collection(db, 'inbody');
    const inBodySnapshot = await getDocs(inBodyRef);
    const inBodyData = inBodySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // جلب بيانات التمارين
    const workoutsRef = collection(db, 'workouts');
    const workoutsSnapshot = await getDocs(workoutsRef);
    const workoutsData = workoutsSnapshot.docs.map(doc => doc.data());

    // جلب بيانات التغذية
    const nutritionRef = collection(db, 'nutrition');
    const nutritionSnapshot = await getDocs(nutritionRef);
    const nutritionData = nutritionSnapshot.docs.map(doc => doc.data());

    // حساب النقاط لكل مستخدم
    const rankings: RankingData[] = users
      .filter(user => user.role === 'member') // فقط الأعضاء
      .map(user => {
        // الحصول على آخر قياس InBody للمستخدم
        const userInBodyData = inBodyData
          .filter(data => data.userId === user.id)
          .sort((a, b) => b.date.toMillis() - a.date.toMillis());
        
        const latestInBody = userInBodyData[0];
        
        const userWorkouts = workoutsData.filter(data => data.userId === user.id);
        const userNutrition = nutritionData.filter(data => data.userId === user.id);

        // حساب نقاط الالتزام
        let commitmentScore = 0;
        commitmentScore += userInBodyData.length * 10; // القياسات
        commitmentScore += userWorkouts.length * 5;    // التمارين
        commitmentScore += userNutrition.length * 3;   // التغذية

        // حساب نقاط InBody
        let inBodyScore = 0;
        if (latestInBody) {
          // مثال لحساب نقاط InBody (يمكن تعديل المعادلة حسب الحاجة)
          inBodyScore = Math.round(
            latestInBody.score +                    // نقاط InBody الأساسية
            (latestInBody.muscleMass * 2) -        // نقاط إضافية للكتلة العضلية
            (latestInBody.fatPercentage * 1.5)     // خصم للدهون الزائدة
          );
        }

        // حساب نسبة التقدم
        const previousInBody = userInBodyData[1];
        const progress = previousInBody 
          ? ((latestInBody?.score - previousInBody.score) / previousInBody.score) * 100 
          : 0;

        return {
          userId: user.id,
          name: user.name,
          commitmentScore: commitmentScore,
          inBodyScore: inBodyScore,
          totalScore: commitmentScore + inBodyScore,
          weight: latestInBody?.weight || null,
          fatPercentage: latestInBody?.fatPercentage || null,
          muscleMass: latestInBody?.muscleMass || null,
          progress: Math.round(progress)
        };
      })
      .sort((a, b) => b.totalScore - a.totalScore); // ترتيب حسب مجموع النقاط

    return rankings;
  } catch (error) {
    console.error('Error fetching rankings:', error);
    throw error;
  }
}; 